from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, field_validator


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

    @field_validator("message")
    @classmethod
    def message_must_not_be_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Message must not be empty")
        return stripped


class ToolCallRecord(BaseModel):
    name: str
    result: Any = None


class ResponseBody(BaseModel):
    type: str = "text"  # "text", "action", "insight"
    content: str
    meta: dict = {}


class ChatResponse(BaseModel):
    status: str = "success"
    conversation_id: int
    response: ResponseBody


class ChatErrorResponse(BaseModel):
    status: str = "error"
    conversation_id: Optional[int] = None
    response: ResponseBody


class ConversationSummary(BaseModel):
    id: int
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    tool_calls_json: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
