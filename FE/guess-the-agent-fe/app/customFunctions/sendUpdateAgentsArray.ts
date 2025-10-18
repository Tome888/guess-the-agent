
import { Agent } from "../types/agents";


export default async function sendUpdateAgentsArray(
  agentsArr: Agent[],
  token: string,
  setterFunction: (agentsArr: Agent[]) => void,
  
) {
  const newAgents = agentsArr.filter((agent) => !agent.eliminated);

  const idsArray = newAgents.map((agent) => agent.id);

  console.log(idsArray, "<-ids");

  try {
    const res = await fetch("http://localhost:5000/api/update-agents-array", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        agents: idsArray,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to update agents");
    }

    setterFunction(newAgents);
   
  } catch (err) {
    console.error("Error updating agents:", err);
  }
}
