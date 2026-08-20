"""Compatibility entry point for the Function Compute start command: python3 app.py."""

import os

from server import Handler, ThreadingHTTPServer


if __name__ == "__main__":
    port = int(os.getenv("PORT", "9000"))
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()
