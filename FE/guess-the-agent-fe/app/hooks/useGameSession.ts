// "use client";
// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import toast from "react-hot-toast";
// import { socket } from "../customFunctions/socket";

// interface GameSession {
//   token: string;
//   userId: string;
//   loading: boolean;
//   turn: string | null;
//   setTurn: (turn: string | null) => void;
//   stopSession:()=>void
// }

// export default function useGameSession(): GameSession {
//   const [token, setToken] = useState("");
//   const [userId, setUserId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [turn, setTurn] = useState<string | null>(null);
//   const router = useRouter();
//   const { roomData } = useParams();

//   useEffect(() => {
//     console.log(turn, "<- TURN IS CHANGED FROM STATE");
//   }, [turn]);

//   const stopSession = () =>{
//     setToken("")
//     setUserId("")
//     setLoading(true)
//     setTurn(null)
//     socket.disconnect()
//     localStorage.clear()
//     router.push("/")
//   }

//   useEffect(() => {
//     const initSession = async () => {
//       try {
//         const ls = localStorage.getItem("gameToken");

//         if (!ls) {
//           const joinRoomPromise = fetch(
//             `http://localhost:5000/api/join-room/${roomData}`
//           )
//             .then(async (res) => {
//               if (!res.ok) throw new Error("Failed to join room");
//               const data = await res.json();

//               localStorage.setItem("gameToken", JSON.stringify(data.token));
//               localStorage.setItem("userId", JSON.stringify(data.playerId));
//               setUserId(data.playerId);
//               setToken(data.token);
//               setTurn(data.turn);
//               return data;
//             })
//             .catch(() => {
//               alert("Wrong or full room");
//               setUserId("");
//               setToken("");
//               setTurn(null);

//               router.push("/");
//             })
//             .finally(() => setLoading(false));

//           toast.promise(joinRoomPromise, {
//             loading: "Checking room availability...",
//             success: "Joined the room successfully!",
//             error: "No open slots available or room does not exist.",
//           });
//           return;
//         }

//         const parsedToken = JSON.parse(ls);
//         await validateToken(parsedToken);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initSession();
//   }, [roomData, router]);

//   const validateToken = async (theToken: string) => {
   
//     const validatePromise = fetch(`http://localhost:5000/api/validate-token`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ tokenClient: theToken }),
//     })
//       .then(async (res) => {
//         if (!res.ok) throw new Error("Invalid or expired token");
//         return await res.json();
//       })
//       .then((data) => {
//         setUserId(data.player.id);
//         setToken(theToken);
//         setTurn(data.turn);
//       })
//       .catch(() => {
//         localStorage.removeItem("gameToken");
//         localStorage.removeItem("userId");
//         socket.disconnect()
//         setUserId("");
//         setToken("");
//         setTurn(null);

//         router.push("/");
//         throw new Error("Invalid or expired token");
//       });

//     toast.promise(validatePromise, {
//       loading: "Validating your session...",
//       success: "Session is valid.",
//       error: "Invalid or expired token. Redirecting...",
//     });
//   };

//   return { token, userId, loading, turn, setTurn, stopSession };
// }



"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { socket } from "../customFunctions/socket";
import { sanitizeString } from "../customFunctions/sanitizeString";

interface GameSession {
  token: string;
  userId: string;
  loading: boolean;
  turn: string | null;
  setTurn: (turn: string | null) => void;
  stopSession: () => void;
}

export default function useGameSession(): GameSession {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [turn, setTurn] = useState<string | null>(null);
  const router = useRouter();
  const { roomData } = useParams();

  useEffect(() => {
    console.log(turn, "<- TURN IS CHANGED FROM STATE");
  }, [turn]);

  const stopSession = () => {
    setToken("");
    setUserId("");
    setLoading(true);
    setTurn(null);
    socket.disconnect();
    localStorage.clear();
    router.push("/");
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        const safeRoom = sanitizeString(roomData as string);

        if (!safeRoom) {
          toast.error("Invalid room name.");
          router.push("/");
          return;
        }

        const ls = localStorage.getItem("gameToken");

        if (!ls) {
          const joinRoomPromise = fetch(
            `http://localhost:5000/api/join-room/${safeRoom}`
          )
            .then(async (res) => {
              if (!res.ok) throw new Error("Failed to join room");
              const data = await res.json();

              // ✅ Sanitize all server values before storing
              const cleanToken = sanitizeString(data.token);
              const cleanId = sanitizeString(data.playerId);
              const cleanTurn = sanitizeString(data.turn);

              if (!cleanToken || !cleanId) throw new Error("Invalid server data");

              localStorage.setItem("gameToken", JSON.stringify(cleanToken));
              localStorage.setItem("userId", JSON.stringify(cleanId));

              setUserId(cleanId);
              setToken(cleanToken);
              setTurn(cleanTurn);
              return data;
            })
            .catch(() => {
              alert("Wrong or full room");
              setUserId("");
              setToken("");
              setTurn(null);
              router.push("/");
            })
            .finally(() => setLoading(false));

          toast.promise(joinRoomPromise, {
            loading: "Checking room availability...",
            success: "Joined the room successfully!",
            error: "No open slots available or room does not exist.",
          });
          return;
        }

        const parsedToken = JSON.parse(ls);
        const safeToken = sanitizeString(parsedToken);
        if (!safeToken) {
          localStorage.removeItem("gameToken");
          router.push("/");
          return;
        }

        await validateToken(safeToken);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [roomData, router]);

  const validateToken = async (theToken: string) => {
    const safeToken = sanitizeString(theToken); // ✅ sanitize token before sending

    const validatePromise = fetch(`http://localhost:5000/api/validate-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenClient: safeToken }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Invalid or expired token");
        const data = await res.json();

        const cleanId = sanitizeString(data.player?.id);
        const cleanTurn = sanitizeString(data.turn);

        if (!cleanId) throw new Error("Invalid player data");

        setUserId(cleanId);
        setToken(safeToken);
        setTurn(cleanTurn);
      })
      .catch(() => {
        localStorage.removeItem("gameToken");
        localStorage.removeItem("userId");
        socket.disconnect();
        setUserId("");
        setToken("");
        setTurn(null);
        router.push("/");
        throw new Error("Invalid or expired token");
      });

    toast.promise(validatePromise, {
      loading: "Validating your session...",
      success: "Session is valid.",
      error: "Invalid or expired token. Redirecting...",
    });
  };

  return { token, userId, loading, turn, setTurn, stopSession };
}
