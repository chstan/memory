// these types are matched to the ones in kata.py

import { AttemptResult } from "../generated/graphql";

function kataCodeToAttemptResult(code: number): AttemptResult {
    switch (code) {
        case 0:
            return AttemptResult.Exception;
        case 1:
            return AttemptResult.Timeout;
        case 2:
            return AttemptResult.Failure;
        case 4:
            return AttemptResult.Easy;
        default:
            throw new Error(`Invalid kata code ${code}`);
    }
}

type KataResult = {
    resultText: string;
    timeBeforeResponding: number;
    result: AttemptResult;
};

export class KataRunner {
    public result: KataResult | null = null;
    private clientText: string;

    constructor(clientText: string) {
        this.clientText = clientText;
    }

    async run(): Promise<KataResult> {
        const startTime = Date.now();

        const worker = new Worker("./kata.worker.js", { type: "module" });
        worker.postMessage(this.clientText)

        const task = new Promise(resolve => { 
            worker.addEventListener("message", resolve);
        });
        const lifetime = new Promise(resolve => { setTimeout(() => { resolve(null); }, 2000)});

        const results = await Promise.any([task, lifetime]);
        const timeBeforeResponding = Date.now() - startTime;
        worker.terminate();

        if (results === null) {
            return {
                timeBeforeResponding,
                resultText: "Execution timed out.",
                result: AttemptResult.Timeout,
            };
        } else {
            return {
                timeBeforeResponding,
                result: kataCodeToAttemptResult((results as MessageEvent).data.responseCode),
                resultText: (results as MessageEvent).data.responseText,
            };
        }
    }
}
