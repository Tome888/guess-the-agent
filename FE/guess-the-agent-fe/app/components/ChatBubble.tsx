"use client";

import { useState } from "react";
import { ChatType } from "../types/agents";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { socket } from "../customFunctions/socket";
import { useParams } from "next/navigation";

export default function ChatBubble({
  id,
  userId,
  answer,
  room_id,
  msg,
  turn,
  myId,
}: ChatType & { turn: string | null; myId: string }) {
  const [open, setOpen] = useState(false);
  const { roomData } = useParams();

  return (
    <div
      className="mb-2 bg-neutral-800 p-2 rounded-md cursor-pointer flex gap-2 flex-col"
      onClick={() => {
        if (turn === myId || answer) return;
        setOpen(!open);
        console.log("turn->", turn, userId);
      }}
    >
      {answer && (
        <div className="bg-amber-700 border border-amber-800 rounded-full w-8 h-8 flex items-center justify-center text-sm">
          {answer}
        </div>
      )}
      <p>{msg}</p>
      {open && (
        <div className="flex items-center justify-center w-[100%] gap-1">
          <button
            className="bg-amber-700 w-[100%] flex justify-center p-1"
            onClick={() =>
              socket.emit("chat-socket", {
                roomId: room_id,
                id,
                msg,
                answer: "Yes",
                userId
              })
            }
          >
            <ThumbsUp />
          </button>

          <button
            className="bg-amber-700 w-[100%] flex justify-center p-1"
            onClick={() =>
              socket.emit("chat-socket", {
                roomId: room_id,
                id,
                msg,
                answer: "No",
                userId
              })
            }
          >
            <ThumbsDown />
          </button>
        </div>
      )}
    </div>
  );
}
