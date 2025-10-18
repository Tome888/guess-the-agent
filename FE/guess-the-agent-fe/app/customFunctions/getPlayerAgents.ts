
import { Agent } from "../types/agents";
export const AGENT_CARDS = [
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
export default async function getPlayerAgents(token: string):Promise<Agent[]> {
  if (!token) return AGENT_CARDS;

  try {
    const res = await fetch("http://localhost:5000/api/get-user-agents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenClient: token }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch player agents");
    }

    const data = await res.json();
    return data.agents; // returns the array of matched agent cards
  } catch (err) {
    console.error("Error fetching player agents:", err);
    return AGENT_CARDS;
  }
}
