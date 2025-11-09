"use client";

import { Agent } from "../types/agents";
import AgentCard from "./AgentCard";

interface CardsWrapperProps {
  token: string;
  userId: string;
  agentsArr: Agent[];
  setAgents: (arr: Agent[]) => void;
  turn: string | null;
}

export default function CardsWrapper({
  token,
  userId,
  agentsArr,
  setAgents,
  turn,
}: CardsWrapperProps) {
  if (!token) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        User is not validated
      </div>
    );
  }

  if (agentsArr.length === 0) {
    return (
      <div className="text-center text-gray-300 mt-10">
        No agents available
      </div>
    );
  }

  return (
    <section className="w-full">
      <h2 className="text-3xl text-amber-500 font-bold mb-6 text-center">
        Select Your Agent
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {agentsArr.map((agent) => (
          <AgentCard
            key={agent.id}
            {...agent}
            turn={turn}
            userId={userId}
            agentArr={agentsArr}
            setAgents={setAgents}
          />
        ))}
      </div>
    </section>
  );
}
