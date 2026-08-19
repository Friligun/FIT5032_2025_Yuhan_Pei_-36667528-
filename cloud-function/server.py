import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

MAX_BODY_BYTES = 32 * 1024
ALLOWED_ACTIONS = {"health-assistant", "send-appointment-email", "health-check"}


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
        # DirectMail credentials must remain server-side. This response is an explicit
        # integration point until the account's verified sender is configured.
        return {
            "success": True,
            "queued": False,
            "message": "Appointment received. Configure Alibaba DirectMail to send the email.",
            "appointmentId": str(appointment.get("id", ""))[:80],
        }
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
