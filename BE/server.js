import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js"; 


const corsUrl="http://localhost:3000"
export const secretKey = "this-should-be-in-env";


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: corsUrl } });


app.use(cors({ origin: corsUrl }));
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));


app.use("/api", routes);


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
