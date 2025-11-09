"use client";

import setAgentsArrCustom from "../customFunctions/setAgentsArrCustom";
import { Agent } from "../types/agents";

interface AgentCardProps {
  setAgents: (arr: Agent[]) => void;
  agentArr: Agent[];
  turn: string | null;
  userId: string;
}

export default function AgentCard({
  id,
  img,
  name,
  eliminated,
  setAgents,
  agentArr,
  turn,
  userId,
}: Agent & AgentCardProps) {
  const handleClick = () => {
    if (turn !== userId) return;

    if (eliminated) {
      const newArr = agentArr.map((agent) =>
        agent.id === id ? { ...agent, eliminated: false } : agent
      );
      setAgents(newArr);
    } else {
      // Original behavior
      setAgentsArrCustom(agentArr, id, setAgents);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-md transition-transform transform hover:scale-105 cursor-pointer ${
        eliminated ? "opacity-40 grayscale" : "bg-neutral-800"
      }`}
    >
      <img
        src={img}
        alt={name}
        className="w-24 h-24 object-contain mb-3 rounded-full border-2 border-amber-500"
      />
      <h3 className="text-white text-lg font-semibold">{name}</h3>
    </div>
  );
}
