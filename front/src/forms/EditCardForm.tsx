import { Button, FormControl } from "@chakra-ui/core";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { SelectOption } from "../common/types";
import CardTagSelect from "../components/CardTagSelect";
import MarkdownTextarea from "../components/MarkdownTextarea";
import { CardSnippetFragment, useUpdateCardMutation } from "../generated/graphql";
import { entityToId } from "../utils/apolloUtils";

interface EditCardFormData extends Omit<CardSnippetFragment, "tags" | "__typename" | "id"> {
  tags: Array<SelectOption<number | string>>;
}

interface IEditCardFormProps {
  card: CardSnippetFragment;
  allowChangeKinds: boolean;
}
export const EditCardForm = (props: IEditCardFormProps) => {
  const [updateCard] = useUpdateCardMutation();
  const { __typename, id, tags, ...restCard } = props.card;

  const defaultValues: EditCardFormData = {
    tags: (tags || []).map((t) => ({ value: t.id!, label: t.name! })),
    ...restCard,
  };

  const { register, watch, control, handleSubmit } = useForm({ defaultValues });
  const watchFrontText = watch("frontText", defaultValues.frontText);
  const watchRearText = watch("rearText", defaultValues.rearText);
  const watchAll = watch();

  const runUpdate = useCallback(async (values: EditCardFormData) => {
    const { tags, ...restValues } = values;
    const tagIds = tags.filter((t) => !t.__isNew__).map((t) => t.value) as Array<number>;
    const newTags = tags.filter((t) => t.__isNew__).map((t) => t.value) as Array<string>;

    const response = await updateCard({
      variables: {
        input: {
          ...restValues,
          tagIds,
          newTags,
          cardId: props.card.id,
          engine: props.card.engine,
          kind: props.card.kind,
        },
      },
      update: (cache, { data }) => {
        cache.evict({ id: entityToId(props.card) });
      },
    });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(runUpdate)}>
        <FormControl>
          <Controller
            control={control}
            name="tags"
            render={({ onChange, onBlur, value, name }) => (
              <CardTagSelect onChange={onChange} name={name} onBlur={onBlur} value={value} />
            )}
          />
          <MarkdownTextarea
            preview={true}
            ref={register}
            name="frontText"
            value={watchFrontText!}
            label="Front Text"
          />
          <MarkdownTextarea
            preview={true}
            ref={register}
            name="rearText"
            value={watchRearText!}
            label="Rear Text"
          />
          <Button type="submit">Save</Button>
        </FormControl>
      </form>
    </>
  );
};
export default EditCardForm;
