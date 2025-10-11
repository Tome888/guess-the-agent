"use client"

import { useState } from "react";
import JoinRoom from "./components/JoinRoom";
import CreateRoomBtn from "./components/CreateRoomBtn";


export default function Home() {
  const [toggle, setToggle] = useState(true)
  
  return (
<main className="flex flex-col gap-2">
  <h1>GUESS THE AGENT</h1>
  <button className="border border-amber-700 cursor-pointer" onClick={()=>setToggle(!toggle)}>{toggle?"Create Room":"Join Room"}</button>
  {
    toggle?<CreateRoomBtn/>:<JoinRoom/>
  }
</main>    
  );
}
