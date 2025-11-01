"use client";

import { useEffect, useState } from "react";
import { Agent } from "../types/agents";
import { ChevronDown } from "lucide-react";
import { socket } from "../customFunctions/socket";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import GuessResultToast from "./GuessResultToast";

interface AgentDropdownProps {
  agents: Agent[];
  turn: string | null;
  userId: string;
  token: string;
  stopSession: ()=>void
}

export default function AgentDropdown({
  agents,
  turn,
  userId,
  token,stopSession
}: AgentDropdownProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { roomData } = useParams();
  const handleSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (turn !== userId || !token) return;

    if (!selectedAgent) {
      console.log("No agent selected");
      return;
    }
    console.log("Selected Agent:", selectedAgent);
    const dataSent = { roomData, userId, ...selectedAgent };
    socket.emit("set-guess", dataSent);
  };

  useEffect(() => {
    if (!turn || !userId || !token) return;

    const handleGuessResult = (data: any) => {
      if (!data?.winner) return;
      stopSession();
      const isWinner = data.winner === userId;

      toast.custom(
        () => (
          <GuessResultToast winner={isWinner} agentId={data.idAgentGuess} />
        ),
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
        onClick={() => {
          turn === userId && setIsOpen(!isOpen);
        }}
        className="w-full bg-neutral-800 border border-amber-500 text-left px-4 py-2 rounded-lg flex items-center justify-between hover:bg-neutral-700 transition"
      >
        <span>{selectedAgent ? selectedAgent.name : "Select an Agent"}</span>
        <ChevronDown
          className={`ml-2 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-14 w-full bg-neutral-900 border border-amber-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => handleSelect(agent)}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-neutral-700 transition"
            >
              <img
                src={agent.img}
                alt={agent.name}
                className={`w-8 h-8 object-contain rounded-full border border-amber-500 ${
                  agent.eliminated ? "opacity-40 grayscale" : "bg-neutral-800"
                }`}
              />
              <span>{agent.name}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg font-semibold transition"
      >
        Submit
      </button>
    </div>
  );
}
