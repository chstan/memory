import { EvaluationEngine } from "../generated/graphql";

export const ENGINE_TO_EDITOR_LANGUAGE = {
    [EvaluationEngine.Localjavascript]: "javascript",
    [EvaluationEngine.Python]: "python",
}

export default {
    ENGINE_TO_EDITOR_LANGUAGE,
}