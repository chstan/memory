import React, { InputHTMLAttributes } from "react";
import { FormLabel, Input, Textarea } from "@chakra-ui/core";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
};

export const InputField = React.forwardRef<any, InputFieldProps>(
  ({ label, size, textarea, name, ...props }, ref) => {
    let InputOrTextarea = Input;
    if (textarea) {
      InputOrTextarea = Textarea;
    }

    return (
      <>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <InputOrTextarea ref={ref} {...props} id={name} name={name} />
      </>
    );
  }
);
