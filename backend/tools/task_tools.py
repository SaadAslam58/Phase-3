import json
from datetime import datetime, timezone
from typing import Optional

from agents import RunContextWrapper, function_tool
from sqlmodel import select

from ai_agents.context import AgentContext
from models import Task


def _task_to_dict(task: Task) -> dict:
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "completed": task.completed,
        "created_at": task.created_at.isoformat(),
        "updated_at": task.updated_at.isoformat(),
    }


@function_tool
async def add_task(
    ctx: RunContextWrapper[AgentContext], title: str, description: Optional[str] = None
) -> str:
    """Create a new task for the user. Returns the created task details as JSON."""
    session = ctx.context.db_session
    user_id = ctx.context.user_id
    task = Task(user_id=user_id, title=title, description=description)
    session.add(task)
    session.commit()
    session.refresh(task)
    return json.dumps(_task_to_dict(task))


@function_tool
async def list_tasks(ctx: RunContextWrapper[AgentContext]) -> str:
    """List all tasks for the current user. Returns a JSON array of tasks."""
    session = ctx.context.db_session
    user_id = ctx.context.user_id
    tasks = session.exec(select(Task).where(Task.user_id == user_id)).all()
    return json.dumps([_task_to_dict(t) for t in tasks])


@function_tool
async def get_task(ctx: RunContextWrapper[AgentContext], task_id: int) -> str:
    """Get a specific task by ID for the current user. Returns task details as JSON."""
    session = ctx.context.db_session
    user_id = ctx.context.user_id
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        return json.dumps({"error": f"Task with id {task_id} not found."})
    return json.dumps(_task_to_dict(task))


@function_tool
async def update_task(
    ctx: RunContextWrapper[AgentContext],
    task_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
) -> str:
    """Update an existing task's title or description. Returns updated task details as JSON."""
    session = ctx.context.db_session
    user_id = ctx.context.user_id
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        return json.dumps({"error": f"Task with id {task_id} not found."})
    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    task.updated_at = datetime.now(timezone.utc)
    session.add(task)
    session.commit()
    session.refresh(task)
    return json.dumps(_task_to_dict(task))


@function_tool
async def complete_task(ctx: RunContextWrapper[AgentContext], task_id: int) -> str:
    """Toggle the completion status of a task. Returns updated task details as JSON."""
    session = ctx.context.db_session
    user_id = ctx.context.user_id
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        return json.dumps({"error": f"Task with id {task_id} not found."})
    task.completed = not task.completed
    task.updated_at = datetime.now(timezone.utc)
    session.add(task)
    session.commit()
    session.refresh(task)
    return json.dumps(_task_to_dict(task))


@function_tool
async def delete_task(ctx: RunContextWrapper[AgentContext], task_id: int) -> str:
    """Delete a task by ID. Returns success or error as JSON."""
    session = ctx.context.db_session
    user_id = ctx.context.user_id
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        return json.dumps({"error": f"Task with id {task_id} not found."})
    session.delete(task)
    session.commit()
    return json.dumps({"success": True, "deleted_task_id": task_id})
