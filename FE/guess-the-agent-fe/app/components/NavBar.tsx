"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Agent } from "../types/agents";
import { AGENT_CARDS } from "../customFunctions/getPlayerAgents";
import leaveAgents from "../customFunctions/leaveGameFunction";
import { sanitizeString } from "../customFunctions/sanitizeString";
import toast from "react-hot-toast";

interface NavBarProps {
  token: string;
  stopSession: () => void;
}

export default function NavBar({ token, stopSession }: NavBarProps) {
  const [myAgent, setMyAgent] = useState<null | Agent>(null);
  const [spinner, setSpinner] = useState(true);

  const { roomData } = useParams();

  useEffect(() => {
    const safeToken = sanitizeString(token); 
    if (!safeToken) return;

    const fetchHomeAgent = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/get-my-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: safeToken }),
        });

        const data = await res.json();        

        if (data.home_agent) {
          const foundAgent = AGENT_CARDS.find(
            (agent) => agent.id === data.home_agent
          );
          setMyAgent(foundAgent ? foundAgent : null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSpinner(false);
      }
    };

    fetchHomeAgent();
  }, [token]);

  const handleCopyRoom = (roomData:string) => {
    if (!roomData) {
      toast.error("No room ID found in URL!");
      return;
    }

    navigator.clipboard.writeText(roomData);
    toast.success("Room ID copied to clipboard!");
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 shadow-md rounded-lg">
      {spinner ? (
        <div className="flex items-center space-x-3">
          <img
            src={AGENT_CARDS[0].img}
            alt={AGENT_CARDS[0].name}
            className="w-12 h-12 rounded-full"
          />
          <p className="text-lg font-semibold">{AGENT_CARDS[0].name}</p>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <img
            src={myAgent?.img}
            alt={myAgent?.name}
            className="w-12 h-12 rounded-full"
          />
          <p className="text-lg font-semibold">{myAgent?.name}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          className="bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300"
          onClick={()=>handleCopyRoom(`${roomData}`)}
        >
          Copy Room ID
        </button>

        <button
          className="bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300"
          onClick={() => {
            const confirmLeave = window.confirm(
              "Are you sure you want to leave the room? This will delete the session."
            );
            if (!confirmLeave) return;

            const safeToken = sanitizeString(token);
            if (safeToken) {
              leaveAgents(safeToken);
              stopSession();
            }
          }}
        >
          Leave Game
        </button>
      </div>
    </nav>
  );
}
