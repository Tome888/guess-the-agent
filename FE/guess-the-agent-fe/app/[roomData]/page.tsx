"use client";

// import { useParams } from "next/navigation"
// import { useEffect, useState } from "react"
// import toast from "react-hot-toast"

// export default function GamePage(){
//     const [gameData, setGameData] = useState()
//     const {roomData} = useParams()

//     useEffect(()=>{
//     const ls = localStorage.getItem("gameToken")
//     if(ls){
//         const parseToken = JSON.parse(ls)
//         // if we have the token we should validate it

//     }else{
//         //if we dont have token then we should check if there is a open slot in the game room if the room id exists
//         toast.promise
//     }

//         console.log(roomData,"roomId")
//     },[roomData])

//     return <section>game page</section>
// }

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
          return data;
        })
        .catch(() => {
          
          router.push("/");
        });

      toast.promise(joinRoomPromise, {
        loading: "Checking room availability...",
        success: "Joined the room successfully!",
        error: "No open slots available or room does not exist.",
      });
    }
  }, [roomData, router]);
  return <section>game page</section>;
}
