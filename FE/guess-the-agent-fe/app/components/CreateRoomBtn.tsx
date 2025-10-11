"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function CreateRoomBtn() {
  const [disableBtn, setDisableBtn] = useState(false);
  const [roomToken, setRoomData] = useState("");
  const router= useRouter()

  const createRoomFunc = async () => {
    setDisableBtn(true);

   
    await toast.promise(
      fetch("http://localhost:5000/api/create-room").then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRoomData(data.roomToken);
        localStorage.setItem("gameToken", JSON.stringify(data.roomToken))
        if(!data.roomId) return
        router.push(`/${data.roomId}`)
        console.log(data)
      }),
      {
        loading: "Creating room...",
        success: "Room created successfully!",
        error: (err: any) =>
          err instanceof Error ? err.message : "An unknown error occurred",
      }
    );

    setDisableBtn(false);
  };

  return (
    <div>
      <button className="border border-amber-600" onClick={createRoomFunc} disabled={disableBtn}>
        {disableBtn ? "Creating..." : "Create Room"}
      </button>

      {roomToken && (
        <p>
          Room created! Room ID: <strong>{roomToken}</strong>
        </p>
      )}
    </div>
  );
}
