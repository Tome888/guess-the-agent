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
    const { playerId, roomId } = tokenData;

    const stmt = db.prepare(
      "SELECT home_agent FROM players WHERE id = ? AND room_id = ?"
    );
    const player = stmt.get(playerId, roomId);

    if (!player) return res.status(404).json({ error: "Player not found" });

    res.json({ home_agent: player.home_agent });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
