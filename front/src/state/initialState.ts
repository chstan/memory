import { KeyboardBoundAction } from "../common/types";

type KeyCombo = Array<string>;
type KeyComboAlternative = Array<KeyCombo>;

export type LocalState = {
    activationChord: [string],
    isActivationChordPressed: boolean,

    chordsForActions: {
        [KeyboardBoundAction.RevealCard]: KeyComboAlternative,
        [KeyboardBoundAction.MarkCardFailed]: KeyComboAlternative,
        [KeyboardBoundAction.MarkCardHard]: KeyComboAlternative,
        [KeyboardBoundAction.MarkCardEasy]: KeyComboAlternative,
        [KeyboardBoundAction.AddCardPopup]: KeyComboAlternative,
        [KeyboardBoundAction.EditCard]: KeyComboAlternative,

        [KeyboardBoundAction.NavigateToStudy]: KeyComboAlternative,
        [KeyboardBoundAction.NavigateToDashboard]: KeyComboAlternative,
        [KeyboardBoundAction.NavigateToProfile]: KeyComboAlternative,

        [KeyboardBoundAction.Submit]: KeyComboAlternative,
    }
}

const INITIAL_STATE: LocalState = {
    activationChord: ["alt"],
    isActivationChordPressed: false,

    // action map
    chordsForActions: {
        [KeyboardBoundAction.RevealCard]: [["r"]],
        [KeyboardBoundAction.MarkCardFailed]: [["0"]],
        [KeyboardBoundAction.MarkCardHard]: [["1"]],
        [KeyboardBoundAction.MarkCardEasy]: [["2"]],
        [KeyboardBoundAction.AddCardPopup]: [["a,c"]],
        [KeyboardBoundAction.EditCard]: [["e"]],

        // navigation commands
        [KeyboardBoundAction.NavigateToStudy]: [["n,s"]],
        [KeyboardBoundAction.NavigateToDashboard]: [["n,d"]],
        [KeyboardBoundAction.NavigateToProfile]: [["n,p"]],

        // forms and form-like components
        [KeyboardBoundAction.Submit]: [["enter"]],
    },
}

export default INITIAL_STATE;