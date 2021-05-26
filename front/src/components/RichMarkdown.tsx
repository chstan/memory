import React, { useCallback, useState } from "react";
import { CB, ValueHandler } from "../common/types";
import Editor from "../components/rich-markdown-editor/src";
import { uploadImage } from "../utils/api";

interface IRichMarkdownEditorProps {
  onChange: ValueHandler<string>,
  onBlur?: CB,
  value: string,
}

export const RichMarkdownEditor = (props: IRichMarkdownEditorProps) => {
  const setValue = useCallback((valueGetter: () => string) => {
    props.onChange(valueGetter());
  }, [props.onChange]);

  // hide-all, hide-1
  return (
    <div className="cloze-wrapper editing markdown-editor">
      <Editor onChange={setValue} uploadImage={uploadImage} />
    </div>
  );
};

interface IRichMarkdownViewerProps {
  value: string;
  clozeOver: null | number | "all";
}

export const RichMarkdownViewer = (props: IRichMarkdownViewerProps) => {
  const noop = useCallback(() => {}, []);

  return (
    <div className="cloze-wrapper markdown-editor readonly">
      <Editor onChange={noop} readOnly value={props.value}></Editor>
    </div>
  );
};

export default {
  RichMarkdownEditor,
  RichMarkdownViewer,
};
