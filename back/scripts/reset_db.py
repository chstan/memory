"""
Completely resets the database.

As a basic safety check, this script only runs on Windows since that is not the deploy environment.
"""

import sys
from pathlib import Path

if __name__ == "__main__":
    print("Resetting database.")

    if "win" not in sys.platform:
        raise ValueError("Cannot run unless on windows.")

    backend_root = (Path(__file__).parent / "..").resolve()

    print("Removing the SQLite database")
    try:
        dev_db = list(backend_root.glob("dev.db"))[0]
        dev_db.unlink()
    except IndexError:
        pass

    print("Removing migrations")
    for migration in list((backend_root / "Migrations").glob("*.cs")):
        migration.unlink()