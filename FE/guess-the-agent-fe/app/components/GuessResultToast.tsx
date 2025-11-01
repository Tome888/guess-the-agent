import { Trophy, Skull } from "lucide-react";
import toast from "react-hot-toast";
import { AGENT_CARDS } from "../customFunctions/getPlayerAgents";


interface GuessResultToastProps {
  winner: boolean; 
  agentId: number;
}

export default function GuessResultToast({ winner, agentId }: GuessResultToastProps) {
  const agent = AGENT_CARDS.find((a) => a.id === agentId);

  return (
    <div className="max-w-sm w-full bg-neutral-900 text-white shadow-xl rounded-2xl pointer-events-auto flex flex-col items-center ring-2 ring-amber-500">
      <div className="flex items-center gap-3 p-4 w-full">
        <div className="flex-shrink-0">
          {winner ? (
            <Trophy className="text-amber-400 w-8 h-8" />
          ) : (
            <Skull className="text-red-500 w-8 h-8" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold">
            {winner ? "You Won! 🏆" : "You Lost 💀"}
          </p>
          <p className="text-sm text-neutral-400 mt-1">
            {winner
              ? `You guessed the correct agent!`
              : `Your opponent guessed your agent.`}
          </p>
        </div>
      </div>

      {agent && (
        <div className="flex items-center gap-3 bg-neutral-800 rounded-lg p-3 m-3 w-full">
          <img
            src={agent.img}
            alt={agent.name}
            className="w-12 h-12 object-contain rounded-full border border-amber-500"
          />
          <span className="text-white font-semibold">{agent.name}</span>
        </div>
      )}

      <button
        onClick={() => toast.dismiss()}
        className="text-sm font-medium text-amber-500 hover:text-amber-400 mb-3"
      >
        OK!
      </button>
    </div>
  );
}
