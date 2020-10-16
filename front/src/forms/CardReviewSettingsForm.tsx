/* prettier-ignore */
import { Box, Button, FormControl, FormLabel, NumberInput, NumberInputField, } from "@chakra-ui/core";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UserSettingsSnippetFragment, useUpdateReviewSettingsMutation } from "../generated/graphql";

interface ICardReviewSettingsFormProps {
  settings: UserSettingsSnippetFragment;
}

export const CardReviewSettingsForm = (props: ICardReviewSettingsFormProps) => {
  const { handleSubmit, control } = useForm({ defaultValues: props.settings });
  const [updateReviewSettings] = useUpdateReviewSettingsMutation();

  const runUpdate = useCallback(
    async (values) => {
      await updateReviewSettings({
        variables: { input: values },
        update: (cache, { data }) => {
          console.log(data);
          cache.evict({ fieldName: "me{}"});
        },
      });
    },
    [updateReviewSettings]
  );

  return (
    <Box>
      <p>Card Review</p>
      <form onSubmit={handleSubmit(runUpdate)}>
        <FormControl>
          <FormLabel htmlFor="newCardDensity">Reviews per Day</FormLabel>
          <Controller
            control={control}
            name="maxReviewsPerDay"
            render={({ onChange, onBlur, value }) => (
              <NumberInput
                min={1}
                max={2000}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
              >
                <NumberInputField />
              </NumberInput>
            )}
          />
          <FormLabel htmlFor="newCardDensity">New Cards per Review</FormLabel>
          <Controller
            control={control}
            name="newCardDensity"
            render={({ onChange, onBlur, value }) => (
              <NumberInput
                min={0.1}
                max={100}
                precision={0.1}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
              >
                <NumberInputField />
              </NumberInput>
            )}
          />
          <Button type="submit">Submit</Button>
        </FormControl>
      </form>
    </Box>
  );
};

export default CardReviewSettingsForm;
