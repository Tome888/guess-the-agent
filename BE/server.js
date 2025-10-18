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
const MAX_ROOM_SIZE = 2;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: corsUrl } });

app.use(cors({ origin: corsUrl }));
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.use("/api", routes);

io.on("connection", (socket) => {
  console.log("🟢Client connected:", socket.id);

 

  // // Receive game data and broadcast
  // socket.on("game_data", ({ roomId, message }) => {
  //   console.log(`💬 Message for room ${roomId}:`, message);
  //   io.to(roomId).emit("receive_data", { sender: socket.id, message });
  // });

  // // Leave room
  // socket.on("leave_room", ({ roomId }) => {
  //   socket.leave(roomId);
  //   io.to(roomId).emit("user_left", { userId: socket.id });
  //   console.log(`Socket ${socket.id} left room ${roomId}`);
  // });

  socket.on("disconnect", () =>
    console.log("🔴Client disconnected:", socket.id)
  );
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //CHAT, AGENT sTATE, FINAL PICK, WINNER

 //validate the token
    //table game-rooms update the turn in the table with THE OTHER PLAYER
    //table players update the according player agents array


// socket.on("join_room", ({ roomId }) => {
//     const room = io.sockets.adapter.rooms.get(roomId);
//     const currentSize = room ? room.size : 0;

    
//     if (currentSize >= MAX_ROOM_SIZE) {
//       socket.emit("room_full", { roomId });
//       return;
//     }


//     socket.join(roomId);

//     const updatedRoom = io.sockets.adapter.rooms.get(roomId);
//     const updatedSize = updatedRoom ? updatedRoom.size : 0;

    
//     if (updatedSize === MAX_ROOM_SIZE) {
//       io.to(roomId).emit("room_ready", { roomId });
//     }
//   });
//   socket.on("game_data", ({ roomId, message }) => {
//     console.log(`💬 Message for room ${roomId}:`, message);

//     io.to(roomId).emit("receive_data", {
//       sender: socket.id,
//       message,
//     });
//   });
//   socket.on("leave_room", ({ roomId }) => {
//     io.to(roomId).emit("user_left", { userId: socket.id });
//     socket.leave(roomId);
//     console.log(`Socket ${socket.id} left room ${roomId}`);
//   });
//   socket.on("disconnect", () => {
//     console.log(`❌ Client disconnected: ${socket.id}`);
//   });
// });