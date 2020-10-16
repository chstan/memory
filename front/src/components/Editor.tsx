import { ControlledEditor } from "@monaco-editor/react";
import { useCallback } from "react";

interface IEditorInputProps {
  language: string;
  isVisible: boolean;
  value: string;
  onChange: (event: Event) => void;
  onBlur?: React.EventHandler<any>;
}

interface IValueOnChange<T> {
  onChange: (value: T) => void;
}

export function EditorInput({ onChange, value, language, isVisible, ...props }: IEditorInputProps) {
  const boundOnChange = useCallback(
    (event: any, eventValue: string | undefined) => {
      if (typeof eventValue === "string") {
        event.target = {
          value: eventValue,
        };
        onChange(event);
      }
    },
    [onChange]
  );

  let editor;

  if (isVisible) {
    editor = (
      <ControlledEditor
        height="200px"
        width="100%"
        value={value}
        className=""
        onChange={boundOnChange}
        theme="dark"
        language={language}
      />
    );
  }

  return (
    <div>
      <div>{editor}</div>
      {value}
    </div>
  );
}

export function ValueEditorInput<ValueT>({
  onChange,
  ...props
}: Omit<IEditorInputProps, "onChange"> & IValueOnChange<ValueT>) {
  const wrappedOnChange = useCallback((event) => onChange(event.target.value), [onChange]);
  return <EditorInput onChange={wrappedOnChange} {...props} />;
}

export default {
  EditorInput,
  ValueEditorInput,
};
