import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";

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

    const room = io.sockets.adapter.rooms.get(roomData);
    const roomSize = room ? room.size : 0;

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

    io.to(roomData).emit("receive_turn", { turn: newTurnPlayer });
  });

  // socket.on("chat-socket", (chatData) => {
  //   const { roomId, msg, answer, userId, id } = chatData;

  //   const room = io.sockets.adapter.rooms.get(roomId);
  //   const numClients = room ? room.size : 0;

  //   if (numClients !== 2) return;

  //   if (answer) {
  //      io.to(roomId).emit("chat-socket", {
  //       id,
  //       room_id: roomId,
  //       msg,
  //       answer,
  //       userId,
  //     });
     
  //   } else {
  //      io.to(roomId).emit("chat-socket", {
  //       id: uuidv4(),
  //       room_id: roomId,
  //       msg,
  //       answer,
  //       userId,
  //     });
  //   }
  // });

socket.on("chat-socket", (chatData) => {
  const { roomId, msg, answer, userId, id } = chatData;

  const room = io.sockets.adapter.rooms.get(roomId);
  const numClients = room ? room.size : 0;

  if (numClients !== 2) return;

  if (answer) {
    const stmt = db.prepare("UPDATE chat SET answer = ? WHERE id = ?");
    const info = stmt.run(answer, id);

    if (info.changes > 0) {
      io.to(roomId).emit("chat-socket", {
        id,
        room_id: roomId,
        msg,
        answer,
        userId,
      });
    }
    return
  } else {
    const newId = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO chat (id, room_id, msg, answer, userId) VALUES (?, ?, ?, ?, ?)"
    );
    stmt.run(newId, roomId, msg, null, userId);

    io.to(roomId).emit("chat-socket", {
      id: newId,
      room_id: roomId,
      msg,
      answer: null,
      userId,
    });
    return
  }
});

  socket.on("disconnect", () => {
    const roomData = socket.data.roomData;
    if (!roomData) return;

    const room = io.sockets.adapter.rooms.get(roomData);
    const roomSize = room ? room.size : 0;

    if (roomSize < 1) {
      return;
    }

    if (roomSize === 1) {
      io.to(roomData).emit("receive_turn", {
        turn: null,
        msg: "Opponent left. Waiting for someone else...",
      });
    }

    console.log(
      `🔴 Socket ${socket.id} disconnected from room ${roomData} (size: ${roomSize})`
    );
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//ADDED change turn, next is seperate socket for CHAT, PICK and Winner
