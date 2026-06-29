# TODO: API key security dependency for FastAPI.
# Responsibilities:
#   - Read the X-API-Key header from incoming requests
#   - Compare against the AI_API_KEY setting from config
#   - Raise HTTP 401 if the key is missing or does not match
#   - Used as a FastAPI Depends() on all protected route handlers
