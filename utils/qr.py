import io
import base64
import qrcode
from qrcode.image.svg import SvgPathImage

def generate_qr_base64(data: str, box_size: int = 10, border: int = 2) -> str:
    """
    Generates a high-contrast QR code as a PNG data URI.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=box_size,
        border=border,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#0f172a", back_color="#ffffff")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    b64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return f"data:image/png;base64,{b64_str}"

def generate_qr_svg(data: str) -> str:
    """
    Generates a responsive SVG QR code string.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=2,
        image_factory=SvgPathImage
    )
    qr.add_data(data)
    qr.make(fit=True)
    svg_img = qr.make_image()
    buffer = io.BytesIO()
    svg_img.save(buffer)
    return buffer.getvalue().decode('utf-8')
