from agents import Agent, handoff

from ai_agents.action_agent import action_agent
from ai_agents.context import AgentContext

ORCHESTRATOR_INSTRUCTIONS = """You are an intelligent task management orchestrator. Your job is to understand the user's intent and delegate to the appropriate specialist agent.

Available agents:
- action_agent: Handles all task CRUD operations (add, list, get, update, complete, delete tasks)

Routing rules:
1. Task management requests (add, create, list, show, view, get, update, edit, complete, done, finish, delete, remove tasks) → hand off to action_agent
2. Greetings and general conversation → respond directly with a friendly message, mentioning you can help manage tasks
3. If the user's intent is unclear, ask a clarifying question

Always be helpful, concise, and friendly.
"""

orchestrator_agent = Agent(
    name="orchestrator_agent",
    instructions=ORCHESTRATOR_INSTRUCTIONS,
    handoffs=[handoff(action_agent)],
)
