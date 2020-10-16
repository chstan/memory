import { Context, createContext } from "react";

import INITIAL_STATE, {LocalState} from "./initialState";

let _localStateContext: Context<LocalState> | null = null;

export const localStateContext = () => {
    if (_localStateContext === null) {
        _localStateContext = createContext(INITIAL_STATE);
    }

    return _localStateContext;
};

export default {
    localStateContext,
}