import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import Database from "better-sqlite3";

const corsUrl = "http://localhost:3000";
export const secretKey = "this-should-be-in-env";
const db = new Database("game.db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: corsUrl } });

app.use(cors({ origin: corsUrl }));
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.use("/api", routes);

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("join_room", (roomData) => {
    socket.join(roomData);
    socket.data.roomData = roomData;
    console.log(`User ${socket.id} joined room ${roomData}`);

    const room = io.sockets.adapter.rooms.get(roomData);
    const roomSize = room ? room.size : 0;
    console.log(`Room ${roomData} size: ${roomSize}`);

    const roomRow = db
      .prepare("SELECT * FROM game_rooms WHERE id = ?")
      .get(roomData);

    if (!roomRow) {
      socket.emit("receive_turn", { error: "Room not found in database" });
      return;
    }

    if (roomSize === 1) {
      io.to(roomData).emit("receive_turn", { turn: null });
    } else if (roomSize === 2) {
      io.to(roomData).emit("receive_turn", { turn: roomRow.turn });
    }
  });

  socket.on("receive_turn", ({ roomData }) => {
    const roomRow = db
      .prepare("SELECT * FROM game_rooms WHERE id = ?")
      .get(roomData);
    if (!roomRow) {
      socket.emit("receive_turn", { error: "Room not found in DB" });
      return;
    }

    const newTurnPlayer =
      roomRow.turn === roomRow.player1 ? roomRow.player2 : roomRow.player1;
    db.prepare("UPDATE game_rooms SET turn = ? WHERE id = ?").run(
      newTurnPlayer,
      roomData
    );

    console.log(`Turn switched! New turn player: ${newTurnPlayer}`);
    io.to(roomData).emit("receive_turn", { turn: newTurnPlayer });
  });

  socket.on("chat-socket", (chatData) => {
    const { roomId, msg, answer, userId } = chatData;

    const room = io.sockets.adapter.rooms.get(roomId);
    const numClients = room ? room.size : 0;

    if (numClients !== 2) return;
    const unixMilliseconds = Date.now();

    io.to(roomId).emit("chat-socket", {
      id: `${unixMilliseconds}`,
      room_id: roomId,
      msg,
      answer,
      userId,
    });
  });

  socket.on("disconnect", () => {
    const roomData = socket.data.roomData;
    if (!roomData) return;

    const room = io.sockets.adapter.rooms.get(roomData);
    const roomSize = room ? room.size : 0;

    if (roomSize < 1) {
      console.log(`Room ${roomData} is empty now.`);
      return;
    }

    if (roomSize === 1) {
      io.to(roomData).emit("receive_turn", {
        turn: null,
        msg: "Opponent left. Waiting for someone else...",
      });
      console.log(`User left room ${roomData}. Only 1 player remains.`);
    }

    console.log(
      `🔴 Socket ${socket.id} disconnected from room ${roomData} (size: ${roomSize})`
    );
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//ADDED change turn, next is seperate socket for CHAT, PICK and Winner
