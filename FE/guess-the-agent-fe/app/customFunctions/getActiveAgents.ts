import { Agent } from "../types/agents";

export function getActiveAgentIds(agents: Agent[]): number[] {
  return agents
    .filter(agent => !agent.eliminated) 
    .map(agent => agent.id);             
}