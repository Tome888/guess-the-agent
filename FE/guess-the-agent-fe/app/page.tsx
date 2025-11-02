// "use client"

// import { useState } from "react";
// import JoinRoom from "./components/JoinRoom";
// import CreateRoomBtn from "./components/CreateRoomBtn";


// export default function Home() {
//   const [toggle, setToggle] = useState(true)
  
//   return (
// <main className="flex flex-col gap-2">
//   <h1>GUESS THE AGENT</h1>
//   <button className="border border-amber-700 cursor-pointer" onClick={()=>setToggle(!toggle)}>{toggle?"Create Room":"Join Room"}</button>
//   {
//     toggle?<CreateRoomBtn/>:<JoinRoom/>
//   }
// </main>    
//   );
// }


"use client";

import { useState } from "react";
import JoinRoom from "./components/JoinRoom";
import CreateRoomBtn from "./components/CreateRoomBtn";

export default function Home() {
  const [toggle, setToggle] = useState(true);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white p-6">
      <div className="bg-neutral-800 rounded-2xl shadow-xl p-10 w-full max-w-md text-center border border-amber-700">
        <h1 className="text-3xl font-bold text-amber-500 mb-6">
          GUESS THE AGENT
        </h1>

        <div className="mb-6 flex justify-center items-center gap-3">
          <button
            onClick={() => setToggle(true)}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
              toggle
                ? "bg-amber-600 text-white shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                : "bg-neutral-700 hover:bg-neutral-600 text-gray-300"
            }`}
          >
            Create Room
          </button>

          <button
            onClick={() => setToggle(false)}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
              !toggle
                ? "bg-amber-600 text-white shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                : "bg-neutral-700 hover:bg-neutral-600 text-gray-300"
            }`}
          >
            Join Room
          </button>
        </div>

        <div className="transition-all duration-300">
          {toggle ? <CreateRoomBtn /> : <JoinRoom />}
        </div>
      </div>
    </main>
  );
}
