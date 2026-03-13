"""
Consistent JSON response helpers.

Success → {"success": true, "data": ...}
Error   → {"success": false, "message": ...}
"""

from fastapi.responses import JSONResponse
from typing import Any


def success_response(data: Any, status_code: int = 200) -> JSONResponse:
    """Return a standardised success envelope."""
    return JSONResponse(
        status_code=status_code,
        content={"success": True, "data": data},
    )


def error_response(message: str, status_code: int = 400) -> JSONResponse:
    """Return a standardised error envelope."""
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "message": message},
    )
