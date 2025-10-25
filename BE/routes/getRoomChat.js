import express from "express";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import { secretKey } from "../server.js";

const router = express.Router();
const db = new Database("game.db");

router.post("/", (req, res)  => {
  const { token } = req.body;
  try {
    const { roomId } = jwt.verify(token, secretKey);

    if (!roomId) {
      return res.status(400).json({ error: "Invalid token payload" });
    }

    const chat  =  db
      .prepare("SELECT * FROM chat WHERE room_id = ?")
      .all(roomId);

    if (!chat) returnres.json({ chatHistory: [] });
    return res.json({ chatHistory: chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
