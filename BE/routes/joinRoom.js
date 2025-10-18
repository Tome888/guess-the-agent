// import express from "express";
// import Database from "better-sqlite3";
// import jwt from "jsonwebtoken";
// import { v4 as uuidv4 } from "uuid";
// import { secretKey } from "../server.js";

// const router = express.Router();
// const db = new Database("game.db");

// router.get("/:roomId", (req, res) => {
//   const { roomId } = req.params;

//   try {

//     const gameRoomsTable = db
//       .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='game_rooms'")
//       .get();
//     const playersTable = db
//       .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='players'")
//       .get();

//     if (!gameRoomsTable || !playersTable) {
//       return res.status(500).json({ msg: "Required tables do not exist in the database" });
//     }

//     const room = db.prepare("SELECT * FROM game_rooms WHERE id = ?").get(roomId);
//     if (!room) {
//       return res.status(404).json({ msg: "Room does not exist" });
//     }

//     if (room.player2 !== null) {
//       return res.status(400).json({ msg: "Room is full" });
//     }

//     const playerId = uuidv4();
//     const randomAgentId = Math.floor(Math.random() * 21) + 1;
//     const agentsArr = Array.from({ length: 21 }, (_, i) => i + 1);

//     db.prepare(
//       "INSERT INTO players (id, room_id, online, home_agent, agents) VALUES (?, ?, ?, ?, ?)"
//     ).run(playerId, roomId, 1, randomAgentId, JSON.stringify(agentsArr));

//     db.prepare("UPDATE game_rooms SET player2 = ? WHERE id = ?").run(playerId, roomId);

//     const token = jwt.sign({ roomId, playerId }, secretKey, { expiresIn: "3h" });

//     res.json({
//       msg: "Player joined successfully",
//       token,
//       roomId,
//       playerId,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// export default router;

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
    // Check if tables exist
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

    // Check if room exists
    const room = db
      .prepare("SELECT * FROM game_rooms WHERE id = ?")
      .get(roomId);
    if (!room) {
      return res.status(404).json({ msg: "Room does not exist" });
    }

    // Check if room is full
    if (room.player2 !== null) {
      return res.status(400).json({ msg: "Room is full" });
    }

    // Create player
    const playerId = uuidv4();
    const randomAgentId = Math.floor(Math.random() * 21) + 1;
    const agentsArr = Array.from({ length: 21 }, (_, i) => i + 1);
     

    db.prepare(
      "INSERT INTO players (id, room_id, online, home_agent, agents) VALUES (?, ?, ?, ?, ?)"
    ).run(playerId, roomId, 1, randomAgentId, JSON.stringify(agentsArr));

    // Update player2
    db.prepare("UPDATE game_rooms SET player2 = ? WHERE id = ?").run(
      playerId,
      roomId
    );

    // ✅ Update the 'turn' column with the joining player's ID
    db.prepare("UPDATE game_rooms SET turn = ? WHERE id = ?").run(
      playerId,
      roomId
    );

    // Create JWT
    const token = jwt.sign({ roomId, playerId }, secretKey, {
      expiresIn: "3h",
    });
    

    res.json({
      msg: "Player joined successfully",
      token,
      roomId,
      playerId,
      turn: playerId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
