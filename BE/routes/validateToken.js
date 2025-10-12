import express from "express";
import jwt from "jsonwebtoken";
import Database from "better-sqlite3";
import { secretKey } from "../server.js";
const router = express.Router();
const db = new Database("./game.db");

router.post("/", (req, res) => {
  const { tokenClient } = req.body;

  if (!tokenClient) {
    return res.status(400).json({ error: "Missing required field: tokenClient" });
  }

  try {
    const tokenData = jwt.verify(tokenClient, secretKey);
    const { roomId, playerId } = tokenData;

    if (!roomId || !playerId) {
      return res.status(400).json({ error: "Invalid token payload" });
    }

    const player = db.prepare(
      "SELECT * FROM players WHERE room_id = ? AND id = ?"
    ).get(roomId, playerId);

    if (!player) {
      return res.status(401).json({ error: "Token data does not match any player" });
    }

    res.status(200).json({ message: "Token is valid", player });
  } catch (err) {
    console.error("Token validation error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;



