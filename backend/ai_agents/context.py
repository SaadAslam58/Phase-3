from dataclasses import dataclass

from sqlmodel import Session


@dataclass
class AgentContext:
    user_id: str
    db_session: Session
