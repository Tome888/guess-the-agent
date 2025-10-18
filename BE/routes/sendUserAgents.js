// import express from "express";
// import jwt from "jsonwebtoken";
// import Database from "better-sqlite3";
// import { secretKey } from "../server.js";
// const router = express.Router();
// const db = new Database("./game.db");

// const AGENT_CARDS = [
//   { id: 1, name: "Astra", img: "/Astra_icon.webp", eliminated: false },
//   { id: 2, name: "Breach", img: "/Breach_icon.webp", eliminated: false },
//   { id: 3, name: "Brimstone", img: "/Brimstone_icon.webp", eliminated: false },
//   { id: 4, name: "Chamber", img: "/Chamber_icon.webp", eliminated: false },
//   { id: 5, name: "Clove", img: "/Clove_icon.webp", eliminated: false },
//   { id: 6, name: "Cypher", img: "/Cypher_icon.webp", eliminated: false },
//   { id: 7, name: "Deadlock", img: "/Deadlock_icon.webp", eliminated: false },
//   { id: 8, name: "Fade", img: "/Fade_icon.webp", eliminated: false },
//   { id: 9, name: "Gekko", img: "/Gekko_icon.webp", eliminated: false },
//   { id: 10, name: "Harbor", img: "/Harbor_icon.webp", eliminated: false },
//   { id: 11, name: "Iso", img: "/Iso_icon.webp", eliminated: false },
//   { id: 12, name: "Jett", img: "/Jett_icon.webp", eliminated: false },
//   { id: 13, name: "KAYO", img: "/KAYO_icon.webp", eliminated: false },
//   { id: 14, name: "Killjoy", img: "/Killjoy_icon.webp", eliminated: false },
//   { id: 15, name: "Neon", img: "/Neon_icon.webp", eliminated: false },
//   { id: 16, name: "Omen", img: "/Omen_icon.webp", eliminated: false },
//   { id: 17, name: "Phoenix", img: "/Phoenix_icon.webp", eliminated: false },
//   { id: 18, name: "Raze", img: "/Raze_icon.webp", eliminated: false },
//   { id: 19, name: "Reyna", img: "/Reyna_icon.webp", eliminated: false },
//   { id: 20, name: "Sage", img: "/Sage_icon.webp", eliminated: false },
//   { id: 21, name: "Skye", img: "/Skye_icon.webp", eliminated: false },
//   { id: 22, name: "Sova", img: "/Sova_icon.webp", eliminated: false },
//   { id: 23, name: "Tejo", img: "/Tejo_icon.webp", eliminated: false },
//   { id: 24, name: "Viper", img: "/Viper_icon.webp", eliminated: false },
//   { id: 25, name: "Vyse", img: "/Vyse_icon.webp", eliminated: false },
//   { id: 26, name: "Waylay", img: "/Waylay_icon.webp", eliminated: false },
//   { id: 27, name: "Yoru", img: "/Yoru_icon.webp", eliminated: false },
// ];

// router.post("/", (req, res) => {
//   try {

//       res.send({ msg: "hello world" });
//   } catch (err) {}
// });

// export default router;

import express from "express";
import jwt from "jsonwebtoken";
import Database from "better-sqlite3";
import { secretKey } from "../server.js";

const router = express.Router();
const db = new Database("./game.db");

const AGENT_CARDS = [
  { id: 1, name: "Astra", img: "/Astra_icon.webp", eliminated: false },
  { id: 2, name: "Breach", img: "/Breach_icon.webp", eliminated: false },
  { id: 3, name: "Brimstone", img: "/Brimstone_icon.webp", eliminated: false },
  { id: 4, name: "Chamber", img: "/Chamber_icon.webp", eliminated: false },
  { id: 5, name: "Clove", img: "/Clove_icon.webp", eliminated: false },
  { id: 6, name: "Cypher", img: "/Cypher_icon.webp", eliminated: false },
  { id: 7, name: "Deadlock", img: "/Deadlock_icon.webp", eliminated: false },
  { id: 8, name: "Fade", img: "/Fade_icon.webp", eliminated: false },
  { id: 9, name: "Gekko", img: "/Gekko_icon.webp", eliminated: false },
  { id: 10, name: "Harbor", img: "/Harbor_icon.webp", eliminated: false },
  { id: 11, name: "Iso", img: "/Iso_icon.webp", eliminated: false },
  { id: 12, name: "Jett", img: "/Jett_icon.webp", eliminated: false },
  { id: 13, name: "KAYO", img: "/KAYO_icon.webp", eliminated: false },
  { id: 14, name: "Killjoy", img: "/Killjoy_icon.webp", eliminated: false },
  { id: 15, name: "Neon", img: "/Neon_icon.webp", eliminated: false },
  { id: 16, name: "Omen", img: "/Omen_icon.webp", eliminated: false },
  { id: 17, name: "Phoenix", img: "/Phoenix_icon.webp", eliminated: false },
  { id: 18, name: "Raze", img: "/Raze_icon.webp", eliminated: false },
  { id: 19, name: "Reyna", img: "/Reyna_icon.webp", eliminated: false },
  { id: 20, name: "Sage", img: "/Sage_icon.webp", eliminated: false },
  { id: 21, name: "Skye", img: "/Skye_icon.webp", eliminated: false },
  { id: 22, name: "Sova", img: "/Sova_icon.webp", eliminated: false },
  { id: 23, name: "Tejo", img: "/Tejo_icon.webp", eliminated: false },
  { id: 24, name: "Viper", img: "/Viper_icon.webp", eliminated: false },
  { id: 25, name: "Vyse", img: "/Vyse_icon.webp", eliminated: false },
  { id: 26, name: "Waylay", img: "/Waylay_icon.webp", eliminated: false },
  { id: 27, name: "Yoru", img: "/Yoru_icon.webp", eliminated: false },
];

router.post("/", (req, res) => {
  const { tokenClient } = req.body;

  if (!tokenClient) {
    return res.status(400).json({ error: "Missing tokenClient" });
  }

  try {
    // Verify and decode JWT
    const decoded = jwt.verify(tokenClient, secretKey);
    const { roomId, playerId } = decoded;

    // Fetch player’s agent list from DB
    const player = db
      .prepare("SELECT agents FROM players WHERE id = ? AND room_id = ?")
      .get(playerId, roomId);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Parse the stored agents array
    const playerAgents = JSON.parse(player.agents || "[]");

    // Match with AGENT_CARDS by id
    const matchedAgents = AGENT_CARDS.filter((agent) =>
      playerAgents.includes(agent.id)
    );

    res.json({
      roomId,
      playerId,
      agents: matchedAgents,
    });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({ error: "Invalid token or database error" });
  }
});

export default router;
