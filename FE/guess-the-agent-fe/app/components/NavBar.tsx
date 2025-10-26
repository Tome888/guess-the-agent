"use client";

import { useEffect, useState } from "react";
import { Agent } from "../types/agents";
import { AGENT_CARDS } from "../customFunctions/getPlayerAgents";
import leaveAgents from "../customFunctions/leaveGameFunction";
import { useRouter } from "next/navigation";
import { socket } from "../customFunctions/socket";

interface NavBarProps {
  token: string;
}

export default function NavBar({ token }: NavBarProps) {
  const [myAgent, setMyAgent] = useState<null | Agent>(null);
  const [spinner, setSpinner] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const fetchHomeAgent = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/get-my-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
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

  return (
    <nav className="w-full flex justify-between items-center p-3">
      {spinner ? (
        <div>
          <img
            src={AGENT_CARDS[0].img}
            alt={AGENT_CARDS[0].name}
            className="w-10 h-10 rounded-full"
          />
          <p>{AGENT_CARDS[0].name}</p>
        </div>
      ) : (
        <div>
          <img
            src={myAgent?.img}
            alt={myAgent?.name}
            className="w-10 h-10 rounded-full"
          />
          <p>{myAgent?.name}</p>
        </div>
      )}

      <button
        className="bg-amber-600 cursor-pointer"
        onClick={() => {
          const confirmLeave = window.confirm(
            "Are you sure you want to leave the room, this will delete the session?"
          );
          if (!confirmLeave) return;
          socket.disconnect()
          leaveAgents(token);
          router.push("/")
        }}
      >
        Leave Game
      </button>
    </nav>
  );
}
