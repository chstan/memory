const RESULT_CODES = {
    Exception: 0,
    Timeout: 1,
    Failure: 2,
    // Hard: 3,
    Success: 4,
}

class RunnerContext {
    constructor() {
        this.results = [];
    }
    
    summarize() {
        return this.results;
    }

    statusCode() {
        for (const result in this.results) {
            if (!result.succeeded) return RESULT_CODES.Failure;
        }
        return RESULT_CODES.Success; 
    }

    testRaises(name, f, contains="") {
        try {
            f()
        } catch (e) {
            if (contains.length === 0 || e.includes(contains)) {
                this.results.push({
                    name: name,
                    succeeded: true,
                    message: null,
                });
            } else {
                this.results.push({
                    name: name,
                    succeeded: false,
                    message: `Exception did not contain: ${contains}.`,
                });
            }
            return
        }
        this.results.push({
            name: name,
            succeeded: false,
            message: "Expected exception.",
        });
    }

    testEquals(name, a, b) {
        this.results.push({ name: name, succeeded: a === b, message: null, });
    }
}

function evaluateClientText(clientText) {
    const runner = new RunnerContext();
    const fn = new Function("runner", clientText);
    try {
        fn(runner);
        return {
            responseText: JSON.stringify(runner.summarize()),
            responseCode: runner.statusCode(),
        };
    } catch (e) {
        return {
            responseText: e.message,
            responseCode: RESULT_CODES.Exception,
        };
    }
}

addEventListener("message", (event) => {
    postMessage(evaluateClientText(event.data));
});
