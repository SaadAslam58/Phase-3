import os

import jwt
from dotenv import load_dotenv

load_dotenv()

BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET", "")
ALGORITHM = "HS256"


def verify_token(token: str) -> dict:
    """Decode and verify a JWT token using BETTER_AUTH_SECRET.

    Returns the decoded payload on success.
    Raises jwt.InvalidTokenError (or subclass) on failure.
    """
    payload = jwt.decode(token, BETTER_AUTH_SECRET, algorithms=[ALGORITHM])
    return payload
