"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function CreateRoomBtn() {
  const [disableBtn, setDisableBtn] = useState(false);
  const router = useRouter();

  const createRoomFunc = async () => {
    setDisableBtn(true);

    await toast.promise(
      fetch("http://localhost:5000/api/create-room").then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        if (!data.roomToken || !data.roomId || !data.playerId)
          throw new Error("Invalid server response");

        localStorage.setItem("gameToken", JSON.stringify(data.roomToken));
        localStorage.setItem("userId", JSON.stringify(data.playerId));

        router.push(`/${data.roomId}`);
      }),
      {
        loading: "Creating room...",
        success: "Room created successfully!",
        error: (err: any) =>
          err instanceof Error ? err.message : "An unknown error occurred",
      }
    ).finally(()=>setDisableBtn(false));

    
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={createRoomFunc}
        disabled={disableBtn}
        className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer border border-amber-600 ${
          disableBtn
            ? "bg-neutral-700 text-gray-400 cursor-not-allowed"
            : "bg-amber-600 hover:bg-amber-700 text-white"
        }`}
      >
        {disableBtn ? "Creating..." : "Create Room"}
      </button>
    </div>
  );
}
