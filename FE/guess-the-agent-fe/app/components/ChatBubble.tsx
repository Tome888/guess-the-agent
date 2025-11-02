// "use client";

// import { useState } from "react";
// import { ChatType } from "../types/agents";
// import { ThumbsDown, ThumbsUp } from "lucide-react";
// import { socket } from "../customFunctions/socket";
// import { useParams } from "next/navigation";

// export default function ChatBubble({
//   id,
//   userId,
//   answer,
//   room_id,
//   msg,
//   turn,
//   myId,
// }: ChatType & { turn: string | null; myId: string }) {
//   const [open, setOpen] = useState(false);
//   const { roomData } = useParams();

//   return (
//     <div
//       className="mb-2 bg-neutral-800 p-2 rounded-md cursor-pointer flex gap-2 flex-col"
//       onClick={() => {
//         if (turn === myId || answer) return;
//         setOpen(!open);
//         console.log("turn->", turn, userId);
//       }}
//     >
//       {answer && (
//         <div className="bg-amber-700 border border-amber-800 rounded-full w-8 h-8 flex items-center justify-center text-sm">
//           {answer}
//         </div>
//       )}
//       <p>{msg}</p>
//       {open && (
//         <div className="flex items-center justify-center w-[100%] gap-1">
//           <button
//             className="bg-amber-700 w-[100%] flex justify-center p-1"
//             onClick={() =>
//               socket.emit("chat-socket", {
//                 roomId: room_id,
//                 id,
//                 msg,
//                 answer: "Yes",
//                 userId
//               })
//             }
//           >
//             <ThumbsUp />
//           </button>

//           <button
//             className="bg-amber-700 w-[100%] flex justify-center p-1"
//             onClick={() =>
//               socket.emit("chat-socket", {
//                 roomId: room_id,
//                 id,
//                 msg,
//                 answer: "No",
//                 userId
//               })
//             }
//           >
//             <ThumbsDown />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { ChatType } from "../types/agents";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { socket } from "../customFunctions/socket";
import { sanitizeString } from "../customFunctions/sanitizeString";

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

  const safeMsg = sanitizeString(msg);

  return (
    <div
      className={`mb-2 p-2 rounded-md cursor-pointer flex flex-col gap-2 
        ${answer ? "bg-amber-900 text-white" : "bg-neutral-800 text-white"} 
        hover:bg-neutral-700 transition`}
      onClick={() => {
        if (turn === myId || answer) return;
        setOpen(!open);
      }}
    >
      {answer && (
        <div className="bg-amber-700 border border-amber-800 rounded-full w-8 h-8 flex items-center justify-center text-sm">
          {answer}
        </div>
      )}

      <p className="break-words">{safeMsg}</p>

      {open && (
        <div className="flex gap-2 w-full mt-1">
          <button
            className="flex-1 bg-amber-700 hover:bg-amber-600 rounded-md p-1 flex items-center justify-center gap-1 transition"
            onClick={() =>
              socket.emit("chat-socket", {
                roomId: room_id,
                id,
                msg: safeMsg,
                answer: "Yes",
                userId,
              })
            }
          >
            <ThumbsUp className="w-4 h-4" /> Yes
          </button>

          <button
            className="flex-1 bg-amber-700 hover:bg-amber-600 rounded-md p-1 flex items-center justify-center gap-1 transition"
            onClick={() =>
              socket.emit("chat-socket", {
                roomId: room_id,
                id,
                msg: safeMsg,
                answer: "No",
                userId,
              })
            }
          >
            <ThumbsDown className="w-4 h-4" /> No
          </button>
        </div>
      )}
    </div>
  );
}
