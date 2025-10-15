// "use client";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import CardsWrapper from "../components/CardsWrapper";

// export default function GamePage() {
//   const [token, setToken] = useState("");
//   const [userId, setUserId] = useState("");
//   const { roomData } = useParams();
//   const router = useRouter();

 

//   useEffect(() => {
//     const ls = localStorage.getItem("gameToken");

//     if (!ls) {
//       const joinRoomPromise = fetch(
//         `http://localhost:5000/api/join-room/${roomData}`
//       )
//         .then(async (res) => {
//           if (!res.ok) throw new Error("Failed to join room");
//           const data = await res.json();

//           localStorage.setItem("gameToken", JSON.stringify(data.token));
//           localStorage.setItem("userId", JSON.stringify(data.playerId));
//           setUserId(data.playerId);
//           setToken(data.token);
//           console.log(data.token, data.playerId, "token and user id");
//           return data;
//         })
//         .catch(() => {
//           alert("wrong or full room");
//           setUserId("");
//           setToken("");
//           router.push("/");
//         });

//       toast.promise(joinRoomPromise, {
//         loading: "Checking room availability...",
//         success: "Joined the room successfully!",
//         error: "No open slots available or room does not exist.",
//       });
//       return;
//     }
//     const parsedToken = JSON.parse(ls);
//     validateToken(parsedToken);
//   }, [roomData, router]);

//   const validateToken = (theToken: string) => {
//     const validatePromise = fetch(`http://localhost:5000/api/validate-token`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ tokenClient: theToken }),
//     })
//       .then(async (res) => {
//         if (!res.ok) throw new Error("Invalid or expired token");
//         return await res.json();
//       })
//       .then((data) => {
//         setUserId(data.player.id);
//         setToken(theToken);
//         console.log(data.player.id, "HERE IS THE DATA");
//       })
//       .catch(() => {
//         localStorage.removeItem("gameToken");
//         localStorage.removeItem("userId");
//         setUserId("");
//         setToken("");
//         router.push("/");
//         throw new Error("Invalid or expired token");
//       });

//     toast.promise(validatePromise, {
//       loading: "Validating your session...",
//       success: "Session is valid.",
//       error: "Invalid or expired token. Redirecting...",
//     });
//   };
//   return (
//     <section className="w-[100%] flex flex-col items-center justify-center">
//       <div className="w-[100%] flex items-center justify-center">
//         <CardsWrapper token={token} userId={userId} />
//       </div>
//     </section>
//   );
// }




"use client";

import { useState } from "react";
import CardsWrapper from "../components/CardsWrapper";
import useGameSession from "../hooks/useGameSession";
import AgentDropdown from "../components/AgentDropdown";
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

export default function GamePage() {
  const { token, userId, loading } = useGameSession();
  const [agents, setAgents]= useState(AGENT_CARDS)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Validating your session...
      </div>
    );
  }


  return (
    <section className="w-[100%] flex flex-col items-center justify-center">
      <div className="w-[100%] flex items-center justify-center">
        <CardsWrapper token={token} userId={userId} agentsArr={agents} />
        <AgentDropdown agents={agents} />
      </div>
    </section>
  );
}
