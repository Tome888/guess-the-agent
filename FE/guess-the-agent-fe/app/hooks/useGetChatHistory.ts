import { useEffect, useState } from "react";
import { ChatType } from "../types/agents";

export default function useGetChatHistory(token: string) {
  const [chatArr, setChatArr] = useState<ChatType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    console.log(chatArr, "CHAT HISTORY!!!")
  },[chatArr])


  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch("http://localhost:5000/api/get-room-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.chatHistory) return;
        setChatArr(data.chatHistory);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  return { chatArr, setChatArr, loading };
}
