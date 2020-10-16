import json
from dataclasses import dataclass
from typing import Optional
import enum
import os
import re
import sys
import subprocess
from pathlib import Path
import uuid
import time


@dataclass
class KataConfig:
    timeout: float = 3
    base_execution_path: Path = None
    use_sandboxing: bool = False


@dataclass
class KataEnvConfig:
    runs_command: str 
    runs_command_sandbox: str
    runner_library_path: str
    kata_header: str
    kata_footer: str

    def __post_init__(self):
        format_kwargs = {
            "runner_library_path": self.runner_library_path,
        }
        self.kata_header = self.kata_header.format(**format_kwargs)
        self.kata_footer = self.kata_footer.format(**format_kwargs)


@dataclass
class KataInput:
    execution_environment: str = "Python"
    execution_context: Optional[str] = None
    source: str = None


class KataResultCode(enum.Enum):
    EXCEPTION = 0 # Code had an unhandled exception
    TIMEOUT   = 1 # Code was running but hit the timeout
    FAILURE   = 2 # Code ran but was not correct, tests did not pass
    # HARD = 3    # For correspondence with enum in the C# code
    SUCCESS   = 4 # Code ran and was correct


@dataclass
class KataResult:
    total_execution_time: float = 0.0
    response_text: str = ""
    response_code: KataResultCode = None


def load_fragment(fragment_filename: str) -> str:
    fragment_path = Path(__file__).parent / "env_configs" / fragment_filename

    with open(str(fragment_path), "r") as f:
        return f.read()


PYTHON_RUNNER_LIBRARY_PATH = str((Path(__file__).parent / ".." / "python_kata_runner").resolve())
KATA_ENVS = {
    ("python", "default"): KataEnvConfig(
        runs_command="python", 
        runs_command_sandbox="python", 
        runner_library_path=PYTHON_RUNNER_LIBRARY_PATH,
        kata_header=load_fragment("python_standard_header.py"),
        kata_footer=load_fragment("python_standard_footer.py"),
    ),
    ("python", "numerical"): KataEnvConfig(
        runs_command="C:\\Users\\chsta\\Miniconda3\\envs\\dl\\python.exe",
        runs_command_sandbox="python",
        runner_library_path=PYTHON_RUNNER_LIBRARY_PATH,
        kata_header=load_fragment("python_standard_header.py"),
        kata_footer=load_fragment("python_standard_footer.py"),
    ),
}


def parse_runner_response(response: str):
    split_output = re.split(r'===RUNNER SUMMARY HEADER===', response)

    if len(split_output) == 1:
        # the runner never got the chance to summarize, which means an unhandled exception
        # occurred
        return None

    return json.loads(split_output[1])


def sanitize_exception(exception_text: str):
    # modified from: https://stackoverflow.com/questions/50618116/regex-for-finding-file-paths
    WINDOWS_REGEX = r'((?:[A-Z]:|(?<![:/\\])[\\\/]|\~[\\\/]|(?:\.{1,2}[\\\/])+)[\w+\\_\-\(\)\/]*(?:\.\w+)*)'
    UNIX_REGEX = r'(?:/[^/]+)+?/\w+\.\w+'

    regex_for_platform = WINDOWS_REGEX
    if os.name == "posix":
        regex_for_platform = UNIX_REGEX
    
    return re.sub(regex_for_platform, "<file>", exception_text)


def execute_python_kata(kata: KataInput, config: KataConfig, env_config: KataEnvConfig) -> KataResult:
    private_directory = config.base_execution_path / str(uuid.uuid4())
    private_directory.mkdir(parents=True, exist_ok=True)
    script_location = private_directory / "script.py"

    runs_command = env_config.runs_command_sandbox if config.use_sandboxing else env_config.runs_command

    with open(str(script_location), "w+") as f:
        f.write(env_config.kata_header)
        f.write(kata.source)
        f.write(env_config.kata_footer)

    started = time.time()
    try:
        run_result = subprocess.run(
            [runs_command, str(script_location)],
            capture_output=True, timeout=config.timeout)
        total_execution_time = time.time() - started

        runner_output = parse_runner_response(run_result.stdout.decode())
        if runner_output is None:
            return KataResult(
                total_execution_time=total_execution_time,
                response_text=json.dumps({
                    "exception": sanitize_exception(run_result.stderr.decode()),
                }),
                response_code=KataResultCode.EXCEPTION
            )

        did_succeed = all([r["succeeded"] for r in runner_output]) 
        return KataResult(
            total_execution_time=total_execution_time,
            response_text=json.dumps(runner_output),
            response_code=KataResultCode.SUCCESS if did_succeed else KataResultCode.FAILURE
        )
    except TimeoutError:
        return KataResult(
            total_execution_time=time.time() - started,
            response_text="",
            response_code=KataResultCode.TIMEOUT
        )
    finally:
        # we are currently assuming there are no files created 
        # by the child process
        script_location.unlink()
        os.rmdir(str(script_location.parent))


def execute_kata(kata: KataInput, config: KataConfig) -> KataResult:
    dispatch_by_environment = {
        "python": execute_python_kata,
    }

    if kata.execution_environment not in dispatch_by_environment:
        raise ValueError(f"Unknown execution environment {kata.execution_environment}")

    env_config = KATA_ENVS.get((kata.execution_environment, kata.execution_context))

    if env_config is None:
        raise ValueError(f"Unknown execution context {kata.execution_context} for environment {kata.execution_environment}.")

    return dispatch_by_environment[kata.execution_environment](kata, config, env_config)
