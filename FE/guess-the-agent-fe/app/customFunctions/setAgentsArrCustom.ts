import { Agent } from "../types/agents";

export default function setAgentsArrCustom(
  agentsArr: Agent[],
  agentId: number,
  setterFunction: (updatedAgents: Agent[]) => void
) {
  const updatedAgents = agentsArr.map((agent) =>
    agent.id === agentId ? { ...agent, eliminated: !agent.eliminated } : agent
  );

  setterFunction(updatedAgents);

  return updatedAgents;
}
