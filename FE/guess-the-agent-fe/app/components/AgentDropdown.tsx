"use client";

import { useState } from "react";
import { Agent } from "../types/agents";
import { ChevronDown } from "lucide-react";

interface AgentDropdownProps {
  agents: Agent[];
}

export default function AgentDropdown({ agents }: AgentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (!selectedAgent) {
      console.log("No agent selected");
      return;
    }
    console.log("Selected Agent:", selectedAgent);
  };

  return (
    <div className="relative w-64 text-white flex flex-col items-center gap-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
                className="w-8 h-8 object-contain rounded-full border border-amber-500"
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
