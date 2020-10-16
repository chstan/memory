import { Box, Flex, FormLabel, Heading, Textarea } from "@chakra-ui/core";
import React from "react";
import {} from "react-hook-form";
import { Markdown } from "./Markdown";

interface IMarkdownTextareaProps {
  preview: Boolean;
  name: string;
  label?: string;
  value?: string;
}

export const MarkdownTextarea = React.forwardRef<HTMLTextAreaElement, IMarkdownTextareaProps>(
  (props, ref) => {
    let renderedPreview;
    let renderedLabel;

    if (props.preview) {
      renderedPreview = (
        <Box width="100%">
          <Markdown source={props.value} />
        </Box>
      );
    }
    if (props.label) {
      renderedLabel = <FormLabel htmlFor={props.name}>{props.label}</FormLabel>;
    }

    return (
      <>
        {renderedLabel}
        <Flex direction="row">
          <Box width="100%">
            <Textarea value={props.value} ref={ref} name={props.name} />
          </Box>
          {renderedPreview}
        </Flex>
      </>
    );
  }
);

export default MarkdownTextarea;
