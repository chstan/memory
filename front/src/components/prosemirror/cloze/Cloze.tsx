import { ChangeEvent, } from "react";
import { wrappingInputRule } from "prosemirror-inputrules";
import Node from "rich-markdown-editor/dist/nodes/Node";
import toggleWrap from "rich-markdown-editor/dist/commands/toggleWrap";

export default class Cloze extends Node {
  get name() {
    return "container_cloze";
  }

  get defaultOptions() {
    return {
      clozeNumbers: [1, 2, 3, 4, 5, 6, 7, 8],
    };
  }

  handleClozeNumberChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { view } = this.editor;
    const { tr } = view.state;
    const element = event.target;
    const { top, left } = element.getBoundingClientRect();
    const result = view.posAtCoords({ top, left });

    if (result) {
      const transaction = tr.setNodeMarkup(result.inside, undefined, {
        clozeNumber: Number.parseInt(element.value),
      });

      view.dispatch(transaction);
    }
  };

  get schema() {
    const tag = "span";
    return {
      attrs: {
        clozeNumber: {
          default: 1,
        },
      },
      group: "block",
      content: "block+",
      defining: true,
      draggable: true,
      parseDOM: this.options.clozeNumbers.map((clozeNumber: number) => ({
        tag: `${tag}.cloze-block.cloze-block-${clozeNumber}`,
        preserveWhitespace: true,
      })),
      toDOM: (node: any) => {
        const select = document.createElement("select");
        select.addEventListener("change", this.handleClozeNumberChange as any);

        this.defaultOptions.clozeNumbers.forEach((value) => {
          const option = document.createElement("option");
          option.value = `${value}`;
          option.innerText = `${value}`;
          option.selected = node.attrs.clozeNumber === value;
          select.appendChild(option);
        });

        return [
          tag,
          { class: `cloze-block cloze-block-${node.attrs.clozeNumber}` },
          [tag, { contentEditable: false }, select],
          [tag, { class: "cloze-content" }, 0],
        ];
      },
    };
  }

  commands({ type }: any) {
    return (attrs: any) => toggleWrap(type, attrs);
  }

  inputRules({ type }: any) {
    return [wrappingInputRule(/^\%\%[0-9]$/, type)];
  }

  toMarkdown(state: any, node: any) {
    console.log(state, node);
    state.write(`\n%%${node.attrs.clozeNumber || 1}`);
    state.renderContent(node);
    state.write("%%");
    state.closeBlock(node);
  }

  parseMarkdown() {
    return {
      block: "container_cloze",
      getAttrs: (token: any) => {
        console.log("Parsing", token);
        return { clozeNumber: token.info };
      },
    };
  }
}
