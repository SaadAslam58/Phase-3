from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from auth.dependencies import verify_user_access
from db import get_session
from models import Task
from schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter()


@router.get("/api/{user_id}/tasks", response_model=list[TaskResponse])
def list_tasks(
    user_id: str,
    current_user: dict = Depends(verify_user_access),
    session: Session = Depends(get_session),
):
    tasks = session.exec(select(Task).where(Task.user_id == user_id)).all()
    return tasks


@router.post("/api/{user_id}/tasks", response_model=TaskResponse, status_code=201)
def create_task(
    user_id: str,
    task_data: TaskCreate,
    current_user: dict = Depends(verify_user_access),
    session: Session = Depends(get_session),
):
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("/api/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    user_id: str,
    task_id: int,
    current_user: dict = Depends(verify_user_access),
    session: Session = Depends(get_session),
):
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/api/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    current_user: dict = Depends(verify_user_access),
    session: Session = Depends(get_session),
):
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    task.updated_at = datetime.now(timezone.utc)

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/api/{user_id}/tasks/{task_id}")
def delete_task(
    user_id: str,
    task_id: int,
    current_user: dict = Depends(verify_user_access),
    session: Session = Depends(get_session),
):
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(task)
    session.commit()
    return {"success": True}


@router.patch("/api/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_task_completion(
    user_id: str,
    task_id: int,
    current_user: dict = Depends(verify_user_access),
    session: Session = Depends(get_session),
):
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = not task.completed
    task.updated_at = datetime.now(timezone.utc)

    session.add(task)
    session.commit()
    session.refresh(task)
    return task
