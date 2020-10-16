import React, { useState } from "react";
import Editor from "rich-markdown-editor";
import { Markdown } from "../components/Markdown";
import Cloze from "../components/prosemirror/cloze/Cloze";

const cloze = new Cloze();

export const RichMarkdownAddCardForm = () => {
  const [value, setValue] = useState("");
  return (
    <>
      {JSON.stringify(value)}
      <Editor
        embeds={[]}
        extensions={[cloze]}
        onChange={setValue}
        uploadImage={async (file: Blob) => {
          console.log(file);
          return "https://www.fillmurray.com/g/200/200";
        }}
      />
      <Editor readOnly={false} value={value} onChange={() => null} extensions={[cloze]} />
      <Markdown source={value} />
    </>
  );
};

export default RichMarkdownAddCardForm;
