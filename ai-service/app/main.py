# TODO: FastAPI application entry point.
# Responsibilities:
#   - Initialize the FastAPI app with title, version, and description
#   - Register API routers: /predict and /explain
#   - Apply API key security dependency globally
#   - Load the ML model and scaler at startup (lifespan event) so they
#     are loaded once and reused across requests — not reloaded per call
#   - Add a /health endpoint for Render uptime checks
