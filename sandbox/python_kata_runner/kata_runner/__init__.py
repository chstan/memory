import json
from dataclasses import dataclass, asdict
from typing import List, Optional

@dataclass
class RunnerResult:
    name: str
    succeeded: bool
    message: Optional[str] = None


class Runner:
    results: List[RunnerResult] = None

    def __init__(self):
        self.results = []

    def test_raises(self, name, f, msg="", contains=""):
        try:
            f()
        except Exception as e:
            if not contains or contains in str(e):
                self.results.append(RunnerResult(name, True))
            else:
                self.results.append(RunnerResult(name, False, f"Exception did not contain: {contains}."))

            return

        self.results.append(RunnerResult(name, False, "Expected exception."))

    def test_equals(self, name, a, b):
        if a == b:
            self.results.append(RunnerResult(name, True))
        else:
            self.results.append(RunnerResult(name, False))

    def summarize(self):
        print("===RUNNER SUMMARY HEADER===\n")
        print(json.dumps([asdict(r) for r in self.results]))