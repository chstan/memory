import React from "react";
import ReactMarkdown from "react-markdown";
import RemarkMathPlugin from "remark-math";
import { BlockMath, InlineMath } from "react-katex";


export const Markdown = (props: any) => {
  const newProps = {
    ...props,
    className: "markdown",
    plugins: [RemarkMathPlugin],
    escapeHtml: false,
    renderers: {
      ...props.renderers,
      math: (props: { value: string }) => <BlockMath>{props.value}</BlockMath>,
      inlineMath: (props: { value: string }) => <InlineMath>{props.value}</InlineMath>,
    },
  };
  return <ReactMarkdown {...newProps} />;
};

export const InlineMarkdown = (props: any) => {
  return (
    <span className="inline-markdown">
      <Markdown {...props} />
    </span>
  );
};

export default {
  Markdown,
  InlineMarkdown,
}