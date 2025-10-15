"use client"

import { Agent } from "../types/agents";

export default function AgentCard({ id, img, name, eliminated }: Agent) {
  return (
    <div
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
