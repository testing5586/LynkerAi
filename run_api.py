#!/usr/bin/env python3
"""
Startup script for Open Notebook API server.
"""

import os
import sys
from pathlib import Path

import uvicorn

# Load environment variables from a .env file if present
try:
    from dotenv import load_dotenv  # type: ignore

    repo_root = Path(__file__).resolve().parent
    env_candidates = [repo_root / ".env", Path.cwd() / ".env"]
    for env_path in env_candidates:
        if env_path.exists():
            load_dotenv(dotenv_path=env_path)
            break
    else:
        load_dotenv()
except Exception:
    pass

# Add the current directory to Python path so imports work
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

if __name__ == "__main__":
    # Default configuration
    host = os.getenv("API_HOST", "127.0.0.1")
    port = int(os.getenv("API_PORT", "5055"))
    reload = os.getenv("API_RELOAD", "true").lower() == "true"

    print(f"Starting Open Notebook API server on {host}:{port}")
    print(f"Reload mode: {reload}")

    uvicorn.run(
        "api.main:app",
        host=host,
        port=port,
        reload=reload,
        reload_dirs=[str(current_dir)] if reload else None,
    )
