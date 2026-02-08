from fastapi import Depends, HTTPException, Request

from auth.jwt import verify_token


def get_current_user(request: Request) -> dict:
    """Extract and verify JWT from Authorization header.

    Returns the decoded token payload containing at least 'sub' (user_id).
    Raises 401 if token is missing or invalid.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")

    token = auth_header.split(" ", 1)[1]
    try:
        payload = verify_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    return payload


def verify_user_access(user_id: str, current_user: dict = Depends(get_current_user)) -> dict:
    """Verify that the URL user_id matches the JWT sub claim.

    Returns the current user payload if access is granted.
    Raises 403 if user_id mismatch.
    """
    if current_user.get("sub") != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    return current_user
