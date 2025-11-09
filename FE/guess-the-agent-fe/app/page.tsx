"use client";

import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";
import JoinRoom from "./components/JoinRoom";
import CreateRoomBtn from "./components/CreateRoomBtn";

export default function HomePage() {
  const [toggle, setToggle] = useState(true);
  const [info, setInfo] = useState(false);

  const showInfo = () => {
    const ls = localStorage.getItem("game-info");

    if (ls) return;

    setInfo(true);
    localStorage.setItem("game-info", "true");
  };

  useEffect(() => {
    showInfo();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start gap-5 bg-neutral-900 text-white p-6 relative">
      <div className="w-full flex justify-end">
        <button
          onClick={() => setInfo(true)}
          className="hover:scale-110 transition-transform"
        >
          <Info color="orange" size={40} />
        </button>
      </div>

      <div className="bg-neutral-800 rounded-2xl shadow-xl p-10 w-full max-w-md text-center border border-amber-700">
        <h1 className="text-3xl font-bold text-amber-500 mb-6">
          GUESS THE AGENT
        </h1>

        <div className="mb-6 flex justify-center items-center gap-3">
          <button
            onClick={() => setToggle(true)}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
              toggle
                ? "bg-amber-600 text-white shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                : "bg-neutral-700 hover:bg-neutral-600 text-gray-300"
            }`}
          >
            Create Room
          </button>

          <button
            onClick={() => setToggle(false)}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
              !toggle
                ? "bg-amber-600 text-white shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                : "bg-neutral-700 hover:bg-neutral-600 text-gray-300"
            }`}
          >
            Join Room
          </button>
        </div>

        <div className="transition-all duration-300">
          {toggle ? <CreateRoomBtn /> : <JoinRoom />}
        </div>
      </div>

      {info && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 border border-amber-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
            <button
              onClick={() => setInfo(false)}
              className="absolute top-3 right-3 hover:scale-110 transition-transform"
            >
              <X size={26} color="white" />
            </button>

            <h2 className="text-2xl font-semibold text-amber-500 mb-4">
              How to Play
            </h2>
            <p className="text-gray-300 text-left leading-relaxed">
              Welcome to{" "}
              <span className="text-amber-400 font-semibold">
                Guess the Agent!
              </span>
              <br />
              <br />
              👥 Create a room or join one using the room code.
              <br />
              🎯 Each player get’s delt a random agent.
              <br />
              ❓ Take turns asking questions to figure out your opponent’s
              agent.
              <br />
              🏆 The first player to guess correctly wins!
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInfo(false)}
                className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-xl font-medium transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
