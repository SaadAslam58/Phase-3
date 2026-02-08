import json
import logging
from datetime import datetime, timezone

from agents import Runner
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ai_agents.context import AgentContext
from ai_agents.orchestrator import orchestrator_agent
from auth.dependencies import verify_user_access
from db import get_session
from models import Conversation, Message
from schemas.chat import (
    ChatErrorResponse,
    ChatRequest,
    ChatResponse,
    ResponseBody,
)

logger = logging.getLogger(__name__)

router = APIRouter()


def _build_history(session: Session, conversation_id: int) -> list[dict]:
    """Build conversation history from DB messages for the agent."""
    messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    ).all()
    history = []
    for msg in messages:
        history.append({"role": msg.role, "content": msg.content})
    return history


@router.post("/api/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: str,
    body: ChatRequest,
    current_user: dict = Depends(verify_user_access),
    session: Session = Depends(get_session),
):
    # Load or create conversation
    conversation = None
    if body.conversation_id:
        conversation = session.exec(
            select(Conversation).where(
                Conversation.id == body.conversation_id,
                Conversation.user_id == user_id,
            )
        ).first()

    if not conversation:
        title = body.message[:50].strip()
        conversation = Conversation(user_id=user_id, title=title)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    # Save user message
    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=body.message,
    )
    session.add(user_message)
    session.commit()

    # Build conversation history
    history = _build_history(session, conversation.id)

    # Create agent context
    agent_context = AgentContext(user_id=user_id, db_session=session)

    try:
        # Run the orchestrator agent
        result = await Runner.run(
            orchestrator_agent,
            input=history,
            context=agent_context,
        )

        # Extract the final output
        response_text = result.final_output

        # Collect tool call info for meta
        tool_calls = []
        for item in result.new_items:
            if hasattr(item, "raw_item") and hasattr(item.raw_item, "type"):
                if item.raw_item.type == "function_call_output":
                    tool_calls.append(
                        {"name": getattr(item, "tool_name", "unknown"), "result": item.raw_item.output}
                    )

        # Save assistant message
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=response_text,
            tool_calls_json=json.dumps(tool_calls) if tool_calls else None,
        )
        session.add(assistant_message)

        # Update conversation timestamp
        conversation.updated_at = datetime.now(timezone.utc)
        session.add(conversation)
        session.commit()

        return ChatResponse(
            status="success",
            conversation_id=conversation.id,
            response=ResponseBody(
                type="text",
                content=response_text,
                meta={"tool_calls": tool_calls} if tool_calls else {},
            ),
        )

    except Exception as e:
        logger.exception("Agent execution failed")
        return ChatErrorResponse(
            status="error",
            conversation_id=conversation.id,
            response=ResponseBody(
                type="text",
                content="I'm sorry, I encountered an error processing your request. Please try again.",
            ),
        )
