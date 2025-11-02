// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { sanitizeString } from "../customFunctions/sanitizeString";

// export default function JoinRoom() {
//   const router = useRouter();
//   const [room, setRoom] = useState("");

//   const handleJoin = (roomId: string) => {
    
//     const validString = sanitizeString(roomId.trim())
//     if (!validString) return;
//     router.push(`/${roomId}`);
//   };
//   return (
//     <form onSubmit={() => handleJoin(room)}>
//       <label>Enter room name</label>
//       <input type="text" onChange={(e) => setRoom(e.target.value)} />
//       <button>Enter</button>
//     </form>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sanitizeString } from "../customFunctions/sanitizeString";
import toast from "react-hot-toast";

export default function JoinRoom() {
  const router = useRouter();
  const [room, setRoom] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validRoom = sanitizeString(room.trim());
    if (!validRoom) {
      toast.error("Invalid room name!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/join-room/${validRoom}`);
      if (!res.ok) throw new Error("Room full or invalid");

      const data = await res.json();

      localStorage.setItem("gameToken", JSON.stringify(data.token));
      localStorage.setItem("userId", JSON.stringify(data.playerId));

      router.push(`/${validRoom}`);
    } catch (err: any) {
      toast.error(err.message || "Cannot join room");
    }
  };

  return (
    <form
      onSubmit={handleJoin}
      className="flex flex-col items-center gap-3 mt-4"
    >
      <label className="text-gray-300 font-medium">Enter Room Name</label>
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-600 bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
        placeholder="Room ID"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors duration-200 w-32"
      >
        Enter
      </button>
    </form>
  );
}
