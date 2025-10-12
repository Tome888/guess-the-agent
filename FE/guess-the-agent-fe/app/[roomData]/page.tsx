"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function GamePage() {
  const [gameData, setGameData] = useState();
  const { roomData } = useParams();
  const router = useRouter();

  useEffect(() => {
    const ls = localStorage.getItem("gameToken");

    if (!ls) {
      const joinRoomPromise = fetch(
        `http://localhost:5000/api/join-room/${roomData}`
      )
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to join room");
          const data = await res.json();
          setGameData(data);
          localStorage.setItem("gameToken", JSON.stringify(data.token));
          localStorage.setItem("userId",JSON.stringify(data.playerId))
          return data;
        })
        .catch(() => {
          alert("wrong or full room");

          router.push("/");
        });

      toast.promise(joinRoomPromise, {
        loading: "Checking room availability...",
        success: "Joined the room successfully!",
        error: "No open slots available or room does not exist.",
      });
      return;
    }
    const parsedToken = JSON.parse(ls);
    validateToken(parsedToken);
  }, [roomData, router]);

  const validateToken = (theToken: string) => {
    const validatePromise = fetch(`http://localhost:5000/api/validate-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenClient: theToken }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Invalid or expired token");
        return await res.json();
      })
      .catch(() => {
        localStorage.removeItem("gameToken");
        localStorage.removeItem("userId");
        router.push("/");
        throw new Error("Invalid or expired token");
      });

    toast.promise(validatePromise, {
      loading: "Validating your session...",
      success: "Session is valid.",
      error: "Invalid or expired token. Redirecting...",
    });
  };
  return <section>game page</section>;
}
