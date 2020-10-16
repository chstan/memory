from .kata import KataConfig
from pathlib import Path

KATA_CONFIG = KataConfig(
    timeout=3,
    base_execution_path=Path(__file__).parent / ".." / "running_katas",
    use_sandboxing=False
)

SECRET_KEY = "dev"
PORT = 5002