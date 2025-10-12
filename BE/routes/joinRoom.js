import express from "express";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { secretKey } from "../server.js";
const router = express.Router();
const db = new Database("game.db");

router.get("/:roomId", (req, res) => {
  const { roomId } = req.params;

  try {
    const gameRoomsTable = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='game_rooms'"
      )
      .get();
    const playersTable = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='players'"
      )
      .get();

    if (!gameRoomsTable || !playersTable) {
      return res
        .status(500)
        .json({ msg: "Required tables do not exist in the database" });
    }

    const room = db
      .prepare("SELECT * FROM game_rooms WHERE id = ?")
      .get(roomId);

    if (!room) {
      return res.status(404).json({ msg: "Room does not exist" });
    }

    const playerCount = db
      .prepare("SELECT COUNT(*) AS count FROM players WHERE room_id = ?")
      .get(roomId).count;

    if (playerCount >= 2) {
      return res.status(400).json({ msg: "Room is full" });
    }

    const playerId = uuidv4();
    const insert = db.prepare(
      "INSERT INTO players (id, room_id, online, home_agent, agents) VALUES (?, ?, ?, ?, ?)"
    );

    const randomAgentId = Math.floor(Math.random() * 21) + 1;
    const agentsArr = Array.from({ length: 21 }, (_, i) => i + 1);

    insert.run(playerId, roomId, 1, randomAgentId, JSON.stringify(agentsArr));

    const token = jwt.sign({ roomId, playerId }, secretKey, {
      expiresIn: "3h",
    });

    res.json({ token, roomId, playerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;