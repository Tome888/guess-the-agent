import express from "express";
import jwt from "jsonwebtoken";
import Database from "better-sqlite3";
import { secretKey } from "../server.js";

const router = express.Router();
const db = new Database("game.db");

router.post("/", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Missing token" });

  try {
    const tokenData = jwt.verify(token, secretKey);
    const { roomId } = tokenData;
    db.prepare("DELETE FROM chat WHERE room_id = ?").run(roomId);
    db.prepare("DELETE FROM players WHERE room_id = ?").run(roomId);
    db.prepare("DELETE FROM game_rooms WHERE id = ?").run(roomId);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
