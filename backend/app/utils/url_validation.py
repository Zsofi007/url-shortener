from __future__ import annotations

from urllib.parse import urlparse, urlunparse


def normalize_and_validate_http_url(raw: str) -> str:
    """
    Normalize and validate user-provided URLs for redirect safety.

    Rules:
    - Empty/whitespace is invalid
    - If scheme missing, assume https
    - Only allow http/https schemes
    - Must have a hostname
    """
    if raw is None:
        raise ValueError("URL is required")

    value = raw.strip()
    if not value:
        raise ValueError("URL is required")

    parsed = urlparse(value)

    # If user typed "example.com" (no scheme), urlparse puts it in path.
    if not parsed.scheme and not parsed.netloc:
        parsed = urlparse(f"https://{value}")

    if parsed.scheme not in ("http", "https"):
        raise ValueError("Only http/https URLs are allowed")

    if not parsed.netloc:
        raise ValueError("URL must include a hostname")

    # Strip fragments (not sent to servers anyway, but keep canonical)
    sanitized = parsed._replace(fragment="")
    return urlunparse(sanitized)

