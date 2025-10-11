#!/usr/bin/env python3
"""Run all pending Open Notebook DB migrations.

Usage:
  .\.venv\Scripts\python.exe scripts\run_migrations.py

This script is a thin wrapper around open_notebook.database.migrate.MigrationManager
and prints clear messages and logs any exceptions.
"""
import sys
import traceback
from pathlib import Path
from loguru import logger

# Load environment variables from a .env file if present
try:
    from dotenv import load_dotenv  # type: ignore

    # Look for a .env in repo root or current directory
    repo_root = Path(__file__).resolve().parents[1]
    env_candidates = [repo_root / ".env", Path.cwd() / ".env"]
    for env_path in env_candidates:
        if env_path.exists():
            load_dotenv(dotenv_path=env_path)
            break
    else:
        # Fallback: try default discovery
        load_dotenv()
except Exception:
    # dotenv is optional; continue without it
    pass

try:
    from open_notebook.database.migrate import MigrationManager
except Exception as e:
    logger.error("Failed to import MigrationManager: {}".format(e))
    traceback.print_exc()
    sys.exit(2)


def main():
    mm = MigrationManager()
    try:
        needs = mm.needs_migration
        print(f"Needs migration? {needs}")
        if needs:
            print("Running migration up...")
            mm.run_migration_up()
            print("Migration finished successfully.")
        else:
            print("Database already up-to-date.")
    except Exception as e:
        logger.error(f"Migration run failed: {e}")
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
