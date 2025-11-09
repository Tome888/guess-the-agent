"use client";

import { useEffect, useState } from "react";
import { Agent } from "../types/agents";
import { ChevronDown } from "lucide-react";
import { socket } from "../customFunctions/socket";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import GuessResultToast from "./GuessResultToast";
import { sanitizeString } from "../customFunctions/sanitizeString";

interface AgentDropdownProps {
  agents: Agent[];
  turn: string | null;
  userId: string;
  token: string;
  stopSession: () => void;
}

export default function AgentDropdown({
  agents,
  turn,
  userId,
  token,
  stopSession,
}: AgentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { roomData } = useParams();

  const handleSelect = (agent: Agent) => {
    if (agent.eliminated) return;
    setSelectedAgent(agent);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (turn !== userId || !token) return;

    if (!selectedAgent) return;

    const safeRoom = sanitizeString(roomData || "");
    const safeAgentName = sanitizeString(selectedAgent.name);

    if (!safeRoom || !safeAgentName) return;

    const dataSent = { roomData: safeRoom, userId, ...selectedAgent, name: safeAgentName };
    socket.emit("set-guess", dataSent);
  };

  useEffect(() => {
    if (!turn || !userId || !token) return;

    const handleGuessResult = (data: any) => {
      if (!data?.winner) return;
      stopSession();

      const isWinner = data.winner === userId;

      toast.custom(
        () => <GuessResultToast winner={isWinner} agentId={data.idAgentGuess} myId={userId} />,
        {
          duration: Infinity,
          position: "top-center",
        }
      );
    };

    socket.on("set-guess", handleGuessResult);

    return () => {
      socket.off("set-guess", handleGuessResult);
    };
  }, [turn, userId, token]);

  return (
    <div className="relative w-64 text-white flex flex-col items-center gap-3">
      <button
        onClick={() => turn === userId && setIsOpen(!isOpen)}
        className="w-full bg-neutral-800 border border-amber-500 text-left px-4 py-2 rounded-lg flex items-center justify-between hover:bg-neutral-700 transition"
      >
        <span>{selectedAgent ? sanitizeString(selectedAgent.name) : "Select an Agent"}</span>
        <ChevronDown
          className={`ml-2 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-14 w-full bg-neutral-900 border border-amber-600 rounded-lg shadow-lg max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-neutral-800">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => handleSelect(agent)}
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition ${
                agent.eliminated ? "opacity-40 grayscale cursor-not-allowed" : "hover:bg-neutral-700"
              }`}
            >
              <img
                src={agent.img}
                alt={sanitizeString(agent.name)}
                className={`w-8 h-8 object-contain rounded-full border border-amber-500`}
              />
              <span>{sanitizeString(agent.name)}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:bg-neutral-700 disabled:text-gray-400"
        disabled={turn !== userId || !selectedAgent}
      >
        Submit
      </button>
    </div>
  );
}
