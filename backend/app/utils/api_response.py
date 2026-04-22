from __future__ import annotations

from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None


def ok(data: Any = None) -> dict[str, Any]:
    return {"success": True, "data": data}


def fail(error: str) -> dict[str, Any]:
    return {"success": False, "error": error}

