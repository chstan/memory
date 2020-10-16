"""
Generates and applies migrations.
"""

import sys
import subprocess
from pathlib import Path


if __name__ == "__main__":
    backend_root = (Path(__file__).parent / "..").resolve()

    try:
        migration_name = sys.argv[1]
    except IndexError:
        subprocess.run(f"dotnet ef database update", cwd=str(backend_root))
        exit()

    print("Generating migrations.")
    add_migration = subprocess.run(
        f"dotnet ef migrations add {migration_name}", 
        cwd=str(backend_root))

    if add_migration.returncode:
        exit()

    subprocess.run(f"dotnet ef migrations list", cwd=str(backend_root))
    subprocess.run(f"dotnet ef database update", cwd=str(backend_root))
