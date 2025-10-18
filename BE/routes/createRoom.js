import express from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import Database from "better-sqlite3";
import { secretKey } from "../server.js";

const router = express.Router();

const db = new Database("game.db");

db.exec(`
CREATE TABLE IF NOT EXISTS game_rooms (
  id TEXT PRIMARY KEY,
  room_token TEXT,
  turn TEXT,
  agent_guess_id INTEGER,
  player_guess_id TEXT,
  player1 TEXT,
  player2 TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  room_id TEXT,
  online INTEGER,
  home_agent INTEGER,
  agents TEXT,
  FOREIGN KEY (room_id) REFERENCES game_rooms(id)
);


CREATE TABLE IF NOT EXISTS chat (
  id TEXT PRIMARY KEY,
  room_id TEXT,
  msg TEXT,
  answer INTEGER,
  userId TEXT,
  FOREIGN KEY (room_id) REFERENCES game_rooms(id)
);
`);

router.get("/", (_, res) => {
  const roomId = uuidv4();
  const playerId = uuidv4();
  const roomToken = jwt.sign({ roomId, playerId }, secretKey, {
    expiresIn: "3h",
  });

  try {
    db.prepare(
      "INSERT INTO game_rooms (id, room_token, turn, agent_guess_id, player_guess_id, player1, player2) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(roomId, roomToken, null, null, null, playerId, null);
    const randomAgentId = Math.floor(Math.random() * 21) + 1;
    const agentsArr = Array.from({ length: 21 }, (_, i) => i + 1);

    const player = {
      id: playerId,
      room_id: roomId,
      online: 1,
      home_agent: randomAgentId,
      agents: JSON.stringify(agentsArr),
    };
    db.prepare(
      "INSERT INTO players (id, room_id, online, home_agent, agents) VALUES (?, ?, ?, ?, ?)"
    ).run(
      player.id,
      player.room_id,
      player.online,
      player.home_agent,
      player.agents
    );

   
    res.json({
      msg: "Room created successfully",
      roomId,
      playerId,
      roomToken,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

export default router;
