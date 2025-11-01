"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { socket } from "../customFunctions/socket";
import useGetChatHistory from "../hooks/useGetChatHistory";
import Spinner from "./Spinner";
import ChatBubble from "./ChatBubble";
import { ChatType } from "../types/agents";

interface ChatProps {
  turn: string | null;
  setTurn: (turn: string | null) => void;
  token: string;
  userId: string;
}

export default function Chat({ turn, setTurn, token, userId }: ChatProps) {
  
  const { chatArr, setChatArr, loading } = useGetChatHistory(token);

  const { roomData } = useParams();

  const [input, setInput] = useState("");

  useEffect(() => {
    if (!token || !userId || !roomData) return;

    const handleChat = (data: ChatType) => {
      console.log("CHAT received:", data);

      setChatArr((prev) => {
        const existingIndex = prev.findIndex((msg) => msg.id === data.id);

        if (existingIndex !== -1) {
          const updatedArr = [...prev];
          updatedArr[existingIndex] = { ...updatedArr[existingIndex], ...data };
          return updatedArr;
        } else {
          return [...prev, data];
        }
      });
    };
    socket.on("chat-socket", handleChat);

    return () => {
      socket.off("chat-socket", handleChat);
    };
  }, [token, userId, roomData]);

  const handleSend = () => {
    if (!input.trim() || turn !== userId) return;
    const sendData = {
      roomId: `${roomData}`,
      msg: input,
      answer: null,
      userId,
    };
    socket.emit("chat-socket", sendData);

    console.log(input);
    setInput("");
  };

  return (
    <div className="w-80 h-96 bg-neutral-900 text-white rounded-xl p-4 flex flex-col">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex-1 overflow-y-auto border border-neutral-700 rounded-lg p-2 mb-3">
          {chatArr.length === 0 ? (
            <p className="text-neutral-400 text-sm">No messages yet</p>
          ) : (
            chatArr.map((chatObj, idx) => (
              // <div
              //   key={chatObj.id}
              //   className="mb-2 bg-neutral-800 p-2 rounded-md"
              // >
              //   {chatObj.msg}
              // </div>

              <ChatBubble
                key={chatObj.id}
                myId={userId}
                id={chatObj.id}
                room_id={chatObj.room_id}
                msg={chatObj.msg}
                answer={chatObj.answer}
                userId={chatObj.userId}
                turn={turn}
              />
            ))
          )}
        </div>
      )}

      {/* {chatArr.length > 0 &&
        chatArr[chatArr.length - 1].userId !== userId &&
        turn === userId && (
          <div className="flex gap-2">
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
          </div>
        )} */}

      {(chatArr.length === 0 ||
        (chatArr[chatArr.length - 1]?.userId !== userId &&
          turn === userId)) && (
        <div className="flex gap-2">
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
        </div>
      )}
    </div>
  );
}
