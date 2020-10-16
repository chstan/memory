import {
  Button,
  Select,
  Tab,
  TabPanel,
  Tabs,
  TabList,
  TabPanels,
  FormControl,
} from "@chakra-ui/core";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { ENGINE_TO_EDITOR_LANGUAGE } from "../common/constants";
import { KeyboardBoundAction, SelectOption } from "../common/types";
import { AddCardInput, CardKind, EvaluationEngine, useAddCardMutation } from "../generated/graphql";
import { useChord, useChordForAction } from "../utils/hooks";
import withApollo from "../utils/withApollo";
import CardTagSelect from "./CardTagSelect";
import { ValueEditorInput } from "./Editor";
import { InputField } from "./InputField";
import KeyboardHint from "./KeyboardHint";

type AddCardFormValues = {
  kind: CardKind;
  tags: Array<SelectOption<number | string>>;

  cloze: {
    frontText: string;
  };
  completion: {
    frontText: string;
  };
  frontAndBack: {
    frontText: string;
    rearText: string;
  };
  kata: {
    engine: EvaluationEngine;
    frontText: string;
  };
};

const CLOZE_PLACEHOLDER_TEXT = "Use a %cloze tag%1 to hide text.";
const COMPLETION_PLACEHOLDER_TEXT = "Use a %completion tag%$ to hide text.";

type EnumOptionMapping = Array<[string, string]>;

function addCardFormValuesToInput(values: AddCardFormValues): AddCardInput {
  const tagFields = {
    newTags: values.tags.filter((t) => t.__isNew__).map((t) => t.value) as string[],
    tagIds: values.tags.filter((t) => !t.__isNew__).map((t) => t.value) as number[],
  };

  if (values.kind === CardKind.Frontandback) {
    return {
      kind: values.kind,
      ...values.frontAndBack,
      engine: EvaluationEngine.Localjavascript,
      ...tagFields,
    };
  } else if (values.kind === CardKind.Completion) {
    return {
      kind: values.kind,
      ...values.completion,
      engine: EvaluationEngine.Localjavascript,
      rearText: "",
      ...tagFields,
    };
  } else if (values.kind === CardKind.Cloze) {
    return {
      kind: values.kind,
      ...values.cloze,
      engine: EvaluationEngine.Localjavascript,
      rearText: "",
      ...tagFields,
    };
  } else if (values.kind === CardKind.Kata) {
    return {
      kind: values.kind,
      ...values.kata,
      rearText: "",
      ...tagFields,
    };
  }

  throw new TypeError(`CardKind value ${values.kind} failed switch`);
}

const CARD_KIND_OPTIONS: EnumOptionMapping = [
  [CardKind.Cloze, "Cloze"],
  [CardKind.Frontandback, "Front + Back"],
  [CardKind.Completion, "Completion"],
  [CardKind.Kata, "Kata"],
];

const EVALUATION_ENGINE_OPTIONS: EnumOptionMapping = [
  [EvaluationEngine.Localjavascript, "JavaScript"],
  [EvaluationEngine.Python, "Python"],
];

const selectForEnum = (mapping: EnumOptionMapping) =>
  React.forwardRef(({ field, ...props }: any, ref) => {
    return (
      <Select {...props} {...field} ref={ref}>
        {mapping.map(([value, label], _) => {
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </Select>
    );
  });

const EngineSelect = selectForEnum(EVALUATION_ENGINE_OPTIONS);

const INITIAL_VALUES: AddCardFormValues = {
  kind: CardKind.Cloze,
  cloze: {
    frontText: "",
  },
  completion: {
    frontText: "",
  },
  frontAndBack: {
    frontText: "",
    rearText: "",
  },
  kata: {
    frontText: "",
    engine: EvaluationEngine.Localjavascript,
  },
  tags: [],
};

const QuickAddCard = () => {
  const [addCard] = useAddCardMutation();

  const { register, watch, control, handleSubmit, setValue } = useForm({
    defaultValues: INITIAL_VALUES,
  });
  const FLAT_KINDS = CARD_KIND_OPTIONS.map(([v, _], __) => v);

  const submit = async (values: AddCardFormValues) => {
    const builtValues = addCardFormValuesToInput(values);
    const response = await addCard({
      variables: { input: builtValues },
    });
  };

  const onSubmit = useCallback(handleSubmit(submit), [handleSubmit]);
  const keyBoundOnSubmit = useCallback(() => onSubmit(), [onSubmit]);

  // set up tabs
  const swapTabCallbacks = FLAT_KINDS.map((v, i) => {
    return useCallback(() => setValue("kind", v), [v, i]);
  });
  FLAT_KINDS.forEach((v, i) => {
    useChord(`${i + 1}`, swapTabCallbacks[i], true);
  });

  useChordForAction(KeyboardBoundAction.Submit, keyBoundOnSubmit);

  const watchEngine: EvaluationEngine = watch("kata.engine") as any;
  const watchKind: CardKind = watch("kind") as any;
  const editorLanguage = ENGINE_TO_EDITOR_LANGUAGE[watchEngine || EvaluationEngine.Python];
  const watchAll = watch();

  return (
    <form onSubmit={onSubmit}>
      <FormControl>
        <Controller control={control} name="tags" render={CardTagSelect} />
        <input type="hidden" ref={register} name={"kind"} />
        <Tabs
          index={FLAT_KINDS.indexOf(watchKind)}
          onChange={(index) => setValue("kind", FLAT_KINDS[index])}
        >
          <TabList>
            {CARD_KIND_OPTIONS.map(([_, label], index) => {
              const l = `${index + 1}`;
              return (
                <Tab key={index}>
                  <KeyboardHint placement="top" hotkey={l}>
                    {label}
                  </KeyboardHint>
                </Tab>
              );
            })}
          </TabList>
          <TabPanels>
            <TabPanel>
              <InputField
                name="cloze.frontText"
                placeholder={CLOZE_PLACEHOLDER_TEXT}
                label="Cloze"
                ref={register}
              />
            </TabPanel>
            <TabPanel>
              <InputField
                name="frontAndBack.frontText"
                placeholder="Front Text"
                label="Font Text"
                ref={register}
              />
              <InputField
                name="frontAndBack.rearText"
                placeholder="Rear Text"
                label="Rear Text"
                ref={register}
              />
            </TabPanel>
            <TabPanel>
              <InputField
                name="completion.frontText"
                placeholder={COMPLETION_PLACEHOLDER_TEXT}
                label="Font Text"
                ref={register}
              />
            </TabPanel>
            <TabPanel>
              <EngineSelect ref={register} name="kata.engine" />
              <Controller
                control={control}
                name={"kata.frontText"}
                render={(props) => (
                  <ValueEditorInput
                    {...props}
                    language={editorLanguage}
                    isVisible={watchKind === CardKind.Kata}
                  />
                )}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <KeyboardHint action={KeyboardBoundAction.Submit}>
          <Button type="submit" variantColor="teal">
            Add
          </Button>
        </KeyboardHint>
      </FormControl>
    </form>
  );
};

export default withApollo(QuickAddCard);
