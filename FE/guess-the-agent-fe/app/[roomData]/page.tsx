"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function GamePage(){
    const {roomData} = useParams()
    useEffect(()=>{
    console.log(roomData,"roomId")
    
    },[roomData])

    
    return <section>game page</section>
}