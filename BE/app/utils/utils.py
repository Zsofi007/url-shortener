def encode_base62(num: int) -> str:
    """Convert a number to Base62 encoding."""
    chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if num == 0:
        return chars[0]
    
    result = ""
    base = len(chars)
    
    while num > 0:
        num, remainder = divmod(num, base)
        result = chars[remainder] + result
    
    return result 