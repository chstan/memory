import React from "react";
import { useLocalStateContext } from "../utils/hooks";
import { KeyboardBoundAction } from "../common/types";
import { BoxProps, ITooltip, Tooltip, } from "@chakra-ui/core";

type ControlledHintExtraProps = {
  action?: KeyboardBoundAction;
  hotkey?: string;
}
type ControlledHintProps = Omit<ITooltip, "aria-label"> & BoxProps & ControlledHintExtraProps;

const ControlledKeyboardHint: React.FC<ControlledHintProps> = ({ action, children, ...props }) => {
  const localState = useLocalStateContext();

  const isActivated = localState.isActivationChordPressed;

  let flatHotKey = props.hotkey || "";
  if (action) {
    const shortcut = localState.chordsForActions[action];
    flatHotKey = shortcut.map(c => c.join(",")).join("|");
  }

  return (
    <Tooltip {...props} isOpen={isActivated} label={flatHotKey} aria-label={flatHotKey}>
      {children}
    </Tooltip>
  );
};

const KeyboardHint: React.FC<ControlledHintProps> = (props) => {
  const { children, ...rest } = props;
    return (
      <ControlledKeyboardHint {...rest}>
        {children}
      </ControlledKeyboardHint>
    );
};

export default KeyboardHint;
