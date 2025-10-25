"use client";

import { useEffect, useState } from "react";
import CardsWrapper from "../components/CardsWrapper";
import useGameSession from "../hooks/useGameSession";
import AgentDropdown from "../components/AgentDropdown";
import { useParams } from "next/navigation";
import { getActiveAgentIds } from "../customFunctions/getActiveAgents";
import { socket } from "../customFunctions/socket";
import getPlayerAgents, {
  AGENT_CARDS,
} from "../customFunctions/getPlayerAgents";
import Chat from "../components/Chat";
import sendUpdateAgentsArray from "../customFunctions/sendUpdateAgentsArray";
import toast from "react-hot-toast";

export default function GamePage() {
  const { token, userId, loading, turn, setTurn } = useGameSession();
  const { roomData } = useParams();

  const [agents, setAgents] = useState(AGENT_CARDS);
  

  useEffect(() => {
    if (!token || !userId || !roomData) return;
    const fetchAgents = async () => {
      const fetchedAgents = await getPlayerAgents(token);
      if (fetchedAgents) {
        setAgents(fetchedAgents);
      }
    };
    fetchAgents();

    socket.emit("join_room", roomData);

    socket.on("receive_turn", (data) => {
      console.log("Turn received:", data);
      if (data.error) return toast.error(data.error);
      setTurn(data.turn);

    });

    return () => {
      socket.disconnect();
    };
  }, [token, userId, roomData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Validating your session...
      </div>
    );
  }

  return (
    <section className="w-[100%] flex flex-col items-center justify-center">
      <div className="w-[100%] flex items-start justify-center pt-[5rem]">
        <div className="p-6">
          {turn === userId ? "Its your turn 🟢" : "opponents turn 🔴"}
          <CardsWrapper
            token={token}
            userId={userId}
            agentsArr={agents}
            setAgents={setAgents}
            turn={turn}
          />
          <button
            onClick={() => {
              if (turn === userId) {
                sendUpdateAgentsArray(agents, token, setAgents);

                socket.emit("receive_turn", {
                  roomData,
                  turnObj: { turn: userId },
                });
              }
            }}
            className="w-full bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg font-semibold transition"
            disabled={turn !== userId}
          >
            Submit
          </button>
        </div>
        <Chat turn={turn} setTurn={setTurn} token={token} userId={userId} />
        <AgentDropdown agents={agents} />
      </div>
    </section>
  );
}
