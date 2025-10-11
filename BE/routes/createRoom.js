// import express from "express";
// import { v4 as uuidv4 } from 'uuid';
// import jwt from "jsonwebtoken";
// const secretKey = "this-should-be-in-env"

// const router = express.Router();

// router.get("/", (_, res) => {
//   const roomToken = jwt.sign({roomId:uuidv4(), playerId: uuidv4()},secretKey,{ expiresIn: "3h" })
//   const idRoom = uuidv4()
//   res.send({msg:"create room", roomToken, idRoom });
// });


// const gameObj={
//   roomId: "uuid4 room id",
//   turn: "playerId",
//   playerGuess: {playerId: "playerId"|null, agentGuess: "agent ID 1-21"|null },
//   players: [playerObj]//max 2 players
// }
// const playerObj={
//   playerId: "id of player",
//   online: true|false,
//   agents:[agent],
//   homeAgent: "id of agent 1-21"
// }

// const agent={
//   agentId: 1,
//   agentName: "string",
//   agentImg: "path to image",
//   eliminated: true|false
// }



// ????
// -- GAMES TABLE
// CREATE TABLE games (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   roomId TEXT UNIQUE NOT NULL,
//   turn TEXT,                    -- playerId of who's turn it is
//   playerGuess_playerId TEXT,    -- player who made a guess (nullable)
//   playerGuess_agentGuess INTEGER, -- agent ID guessed (1–21)
//   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
// );

// -- PLAYERS TABLE
// CREATE TABLE players (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   playerId TEXT UNIQUE NOT NULL,
//   gameId INTEGER NOT NULL,
//   online BOOLEAN DEFAULT 1,
//   homeAgent INTEGER,             -- ID of the player's home agent
//   FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE CASCADE
// );

// -- AGENTS TABLE
// CREATE TABLE agents (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   agentId INTEGER NOT NULL,      -- 1–21
//   agentName TEXT,
//   agentImg TEXT,
//   eliminated BOOLEAN DEFAULT 0,
//   playerId TEXT NOT NULL,
//   FOREIGN KEY (playerId) REFERENCES players(playerId) ON DELETE CASCADE
// );



import express from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import Database from "better-sqlite3";

const secretKey = "this-should-be-in-env";
const router = express.Router();


const db = new Database("game.db");


db.exec(`
CREATE TABLE IF NOT EXISTS game_rooms (
  id TEXT PRIMARY KEY,
  room_token TEXT,
  turn TEXT,
  player_guess TEXT,
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
`);


router.get("/", (req, res) => {
  const roomId = uuidv4();
  const playerId = uuidv4();
  const roomToken = jwt.sign({ roomId, playerId }, secretKey, { expiresIn: "3h" });

  try {
   
    db.prepare(
      "INSERT INTO game_rooms (id, room_token, turn, player_guess) VALUES (?, ?, ?, ?)"
    ).run(roomId, roomToken, playerId, null);
const randomAgentId = Math.floor(Math.random() * 21) + 1;
const agentsArr = Array.from({ length: 21 }, (_, i) => i + 1)   

    const player = {
      id: playerId,
      room_id: roomId,
      online: 1,
      home_agent: randomAgentId,
      agents: JSON.stringify(agentsArr),
    };
    db.prepare(
      "INSERT INTO players (id, room_id, online, home_agent, agents) VALUES (?, ?, ?, ?, ?)"
    ).run(player.id, player.room_id, player.online, player.home_agent, player.agents);

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