import express from "express";
import jwt from "jsonwebtoken";
import Database from "better-sqlite3";
import { secretKey } from "../server.js";

const router = express.Router();
const db = new Database("./game.db");

router.post("/", (req, res) => {
  const { token, agents } = req.body;

  if (!token || !Array.isArray(agents)) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const { roomId, playerId } = decoded;

    if (!playerId || !roomId) {
      
      return res.status(400).json({ error: "Invalid token payload" });
    }

    const player = db
      .prepare("SELECT * FROM players WHERE id = ? AND room_id = ?")
      .get(playerId, roomId);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    db.prepare(
      "UPDATE players SET agents = ? WHERE id = ? AND room_id = ?"
    ).run(JSON.stringify(agents), playerId, roomId);

    return res.json({ success: true, message: "Agents updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;







