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

// io.on("connection", (socket) => {
//   console.log("🟢Client connected:", socket.id);

//   socket.on("join_room", (roomData) => {
//     socket.join(roomData);
//     console.log(`User ${socket.id} joined room ${roomData}❓❓❓`);
//   });


// socket.on("send_turn", ({ roomData }) => {
//   const room = io.sockets.adapter.rooms.get(roomData);
//   const roomSize = room ? room.size : 0;

//   if (roomSize < 2) {
//     console.log("Won't send: room has only 1 user");
//     socket.emit("receive_turn", { error: "You can't play alone Buddy 😉" });
//     return;
//   }

//   
//   const roomRow = db.prepare("SELECT * FROM game_rooms WHERE id = ?").get(roomData);

//   if (!roomRow) {
//     console.log("Room not found in DB:", roomData);
//     socket.emit("receive_turn", { error: "Room not found in database" });
//     return;
//   }

//  
//   let newTurnPlayer;
//   if (roomRow.turn === roomRow.player1) {
//     newTurnPlayer = roomRow.player2;
//   } else {
//     newTurnPlayer = roomRow.player1;
//   }

//  
//   db.prepare("UPDATE game_rooms SET turn = ? WHERE id = ?").run(newTurnPlayer, roomData);

//   console.log(`Turn switched! New turn player: ${newTurnPlayer}`);

//   
//   io.to(roomData).emit("receive_turn", { turn: newTurnPlayer });
// });

//   socket.on("disconnect", () =>
//     console.log("🔴Client disconnected:", socket.id)
//   );
// });


io.on("connection", (socket) => {
  console.log("🟢Client connected:", socket.id);

  // --- Join a room ---
  socket.on("join_room", (roomData) => {
    socket.join(roomData);
    console.log(`User ${socket.id} joined room ${roomData}❓❓❓`);

    // Send the current room size to all clients in the room
    const room = io.sockets.adapter.rooms.get(roomData);
    const roomSize = room ? room.size : 0;
    io.to(roomData).emit("room_info", { size: roomSize });
  });

  // --- Send turn ---
  socket.on("send_turn", ({ roomData }) => {
    const room = io.sockets.adapter.rooms.get(roomData);
    const roomSize = room ? room.size : 0;

    if (roomSize < 2) {
      console.log("Won't send: room has only 1 user");
      socket.emit("receive_turn", { error: "You can't play alone Buddy 😉" });
      return;
    }

    
    const roomRow = db.prepare("SELECT * FROM game_rooms WHERE id = ?").get(roomData);

    if (!roomRow) {
      console.log("Room not found in DB:", roomData);
      socket.emit("receive_turn", { error: "Room not found in database" });
      return;
    }

   
    const newTurnPlayer = roomRow.turn === roomRow.player1 ? roomRow.player2 : roomRow.player1;

   
    db.prepare("UPDATE game_rooms SET turn = ? WHERE id = ?").run(newTurnPlayer, roomData);

    console.log(`Turn switched! New turn player: ${newTurnPlayer}`);

    
    io.to(roomData).emit("receive_turn", { turn: newTurnPlayer });
  });

 
  socket.on("disconnect", () => {
    console.log("🔴Client disconnected:", socket.id);

    
    socket.rooms.forEach((roomData) => {
      const room = io.sockets.adapter.rooms.get(roomData);
      const roomSize = room ? room.size : 0;
      io.to(roomData).emit("room_info", { size: roomSize });
    });
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //CHAT, AGENT sTATE, FINAL PICK, WINNER

//validate the token
//table game-rooms update the turn in the table with THE OTHER PLAYER
//table players update the according player agents array


