"use client";

import setAgentsArrCustom from "../customFunctions/setAgentsArrCustom";
import { Agent } from "../types/agents";

interface AgentCardProps {
  setAgents: (arr: Agent[]) => void;
  agentArr: Agent[]
}
export default function AgentCard({
  id,
  img,
  name,
  eliminated,
  setAgents,
  agentArr
}: Agent & AgentCardProps) {
  return (
    <div
    onClick={()=>setAgentsArrCustom(agentArr, id, setAgents)}
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
