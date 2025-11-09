"use client";

import { useEffect, useState } from "react";
import CardsWrapper from "../components/CardsWrapper";
import useGameSession from "../hooks/useGameSession";
import AgentDropdown from "../components/AgentDropdown";
import { useParams } from "next/navigation";
import { socket } from "../customFunctions/socket";
import getPlayerAgents, { AGENT_CARDS } from "../customFunctions/getPlayerAgents";
import Chat from "../components/Chat";
import sendUpdateAgentsArray from "../customFunctions/sendUpdateAgentsArray";
import toast from "react-hot-toast";
import NavBar from "../components/NavBar";
import { sanitizeString } from "../customFunctions/sanitizeString";

export default function GamePage() {
  const { token, userId, loading, turn, setTurn, stopSession } = useGameSession();
  const { roomData } = useParams();

  const [agents, setAgents] = useState(AGENT_CARDS);

  const safeRoom = sanitizeString(roomData || "");
  const safeToken = sanitizeString(token);
  const safeUser = sanitizeString(userId);

  useEffect(() => {
    if (!safeToken || !safeUser || !safeRoom) return;

    const fetchAgents = async () => {
      const fetchedAgents = await getPlayerAgents(safeToken);
      if (fetchedAgents) setAgents(fetchedAgents);
    };
    fetchAgents();

    socket.emit("join_room", safeRoom);

    const handleReceiveTurn = (data: any) => {
      if (data.error) return toast.error(sanitizeString(data.error));
      const safeTurn = sanitizeString(data.turn);
      setTurn(safeTurn);
    };

    socket.on("receive_turn", handleReceiveTurn);

    return () => {
      socket.off("receive_turn", handleReceiveTurn);
      socket.disconnect();
    };
  }, [safeToken, safeUser, safeRoom, setTurn]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-200">
        Validating your session...
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col items-center justify-center px-4">
      <NavBar token={token} stopSession={stopSession} />
      <div className="w-full flex flex-col lg:flex-row items-start justify-center pt-20 gap-6">
        <div className="p-6 bg-neutral-800 rounded-2xl shadow-lg border border-amber-700 w-full lg:w-1/2">
          <p className="mb-4 font-semibold text-lg">
            {turn === userId ? "It's your turn 🟢" : "Opponent's turn 🔴"}
          </p>

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
                  roomData: safeRoom,
                  turnObj: { turn: safeUser },
                });
              }
            }}
            className="w-full bg-amber-600 hover:bg-amber-700 px-4 py-2 mt-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={turn !== userId}
          >
            Submit
          </button>
        </div>

        <div className="flex flex-col gap-6 w-full lg:w-1/3">
          <Chat turn={turn} setTurn={setTurn} token={token} userId={userId} />
          <AgentDropdown
            token={token}
            userId={userId}
            turn={turn}
            agents={agents}
            stopSession={stopSession}
          />
        </div>
      </div>
    </section>
  );
}
