import string
import random
import base64
import io
import qrcode
from typing import Optional


def encode_base62(num: int) -> str:
    """
    Encode a number to base62 string
    """
    if num == 0:
        return "0"
    
    chars = string.digits + string.ascii_letters
    result = ""
    
    while num > 0:
        num, remainder = divmod(num, 62)
        result = chars[remainder] + result
    
    return result


def generate_qr_code(url: str, size: int = 200) -> str:
    """
    Generate a QR code for the given URL and return it as a base64 encoded string
    
    Args:
        url: The URL to encode in the QR code
        size: The size of the QR code in pixels (default: 200)
    
    Returns:
        Base64 encoded string of the QR code image
    """
    try:
        # Create QR code instance
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        
        # Add data to QR code
        qr.add_data(url)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Resize image if needed
        if size != 200:
            img = img.resize((size, size))
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        # Encode to base64
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
        
    except Exception as e:
        # Return a placeholder or error image if QR generation fails
        raise Exception(f"Failed to generate QR code: {str(e)}")


def generate_random_string(length: int = 8) -> str:
    """
    Generate a random alphanumeric string
    """
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length)) 