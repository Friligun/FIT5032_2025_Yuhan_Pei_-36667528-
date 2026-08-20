import json
import os
import smtplib
from email.message import EmailMessage
from email.utils import parseaddr
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

MAX_BODY_BYTES = 32 * 1024
ALLOWED_ACTIONS = {"health-assistant", "send-appointment-email", "health-check"}


def _valid_email(value):
    address = parseaddr(str(value or ""))[1].strip()
    return address if address and "@" in address and " " not in address else ""


def send_appointment_email(appointment):
    recipient = _valid_email(appointment.get("userEmail"))
    sender = _valid_email(os.getenv("MAIL_FROM") or os.getenv("SMTP_USER"))
    host = os.getenv("SMTP_HOST", "smtp.qq.com")
    password = os.getenv("SMTP_PASSWORD")
    if not recipient or not sender or not password:
        return {"success": False, "queued": False, "message": "Email service is not configured."}

    service_name = str(appointment.get("serviceName", "Health service"))[:120]
    date = str(appointment.get("date", ""))[:30]
    time = str(appointment.get("time", ""))[:20]
    notes = str(appointment.get("notes", "")).strip()[:300]
    message = EmailMessage()
    message["Subject"] = f"HealthBridge appointment confirmation - {service_name}"
    message["From"] = sender
    message["To"] = recipient
    message.set_content(
        "Your HealthBridge appointment has been confirmed.\\n\\n"
        f"Service: {service_name}\\nDate: {date}\\nTime: {time}\\n"
        f"Notes: {notes or 'None'}\\n\\n"
        "This is an automated confirmation. Contact the service provider if you need to change the appointment."
    )
    with smtplib.SMTP_SSL(host, int(os.getenv("SMTP_PORT", "465")), timeout=12) as smtp:
        smtp.login(sender, password)
        smtp.send_message(message)
    return {"success": True, "queued": True, "message": "Confirmation email sent.", "appointmentId": str(appointment.get("id", ""))[:80]}


def response_payload(action, payload):
    if action == "health-check":
        return {"success": True, "service": "healthbridge-api"}
    if action == "health-assistant":
        question = str(payload.get("question", "")).strip()[:500]
        return {
            "success": True,
            "configured": False,
            "answer": (
                "HealthBridge can help you find general resources about sleep, nutrition, "
                "exercise, mental wellbeing and local services. Your question was received: "
                f"{question or 'Please choose a health topic.'} For personal medical advice, "
                "contact a qualified health professional."
            ),
        }
    if action == "send-appointment-email":
        appointment = payload.get("appointment", {})
        try:
            return send_appointment_email(appointment)
        except (OSError, smtplib.SMTPException, ValueError):
            return {"success": False, "queued": False, "message": "Confirmation email could not be sent."}
    return {"success": False, "message": "Unsupported action."}


class Handler(BaseHTTPRequestHandler):
    def _send(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", os.getenv("ALLOWED_ORIGIN", "*"))
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send(204, {})

    def do_GET(self):
        self._send(200, {"success": True, "service": "healthbridge-api", "action": "health-check"})

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > MAX_BODY_BYTES:
                self._send(413, {"success": False, "message": "Request body is too large."})
                return
            raw = self.rfile.read(length)
            request = json.loads(raw.decode("utf-8"))
            action = str(request.get("action", "")).strip()
            if action not in ALLOWED_ACTIONS:
                self._send(400, {"success": False, "message": "Unsupported action."})
                return
            self._send(200, response_payload(action, request.get("payload") or {}))
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError):
            self._send(400, {"success": False, "message": "Invalid JSON request."})
        except Exception:
            self._send(500, {"success": False, "message": "Internal function error."})


if __name__ == "__main__":
    port = int(os.getenv("PORT", "9000"))
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()
