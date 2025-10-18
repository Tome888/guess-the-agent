import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { socket } from "../customFunctions/socket";

interface ChatProps {
  turn: string | null;
  setTurn: (turn: string | null) => void;
  token: string;
  userId: string;
}

type ChatType = {
  id: string;
  room_id: string;
  msg: string;
  answer: number;
  userId: string;
};

export default function Chat({ turn, setTurn, token, userId }: ChatProps) {


  const { roomData } = useParams();

  const [chatArr, setChatArr] = useState<ChatType[]>([]);
  const [input, setInput] = useState("");


  useEffect(() => {
    if (!token || !userId || !roomData) return;
  }, [token, userId, roomData]);



  const handleSend = () => {
    if (!input.trim()) return;
    console.log(input);
    setInput("");
  };


  return (
    <div className="w-80 h-96 bg-neutral-900 text-white rounded-xl p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto border border-neutral-700 rounded-lg p-2 mb-3">
        {chatArr.length >= 0 ? (
          <p className="text-neutral-400 text-sm">No messages yet</p>
        ) : (
          chatArr.map((chatObj) => (
            <div
              key={chatObj.id}
              className="mb-2 bg-neutral-800 p-2 rounded-md"
            >
              {chatObj.msg}
            </div>
          ))
        )}
      </div>

      {turn===userId&&<div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-sm outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-amber-600 hover:bg-amber-700 rounded-lg px-4 text-sm font-semibold"
        >
          Send
        </button>
      </div>}
    </div>
  );
}
