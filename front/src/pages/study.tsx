import React, { useCallback, useReducer, useState } from "react";
import NextLink from "next/link";
import {
  AttemptKataMutation,
  AttemptResult,
  CardKind,
  CardSnippetFragment,
  EvaluationEngine,
  useAttemptKataMutation,
  useCardsDueQuery,
  useReportAttemptMutation,
} from "../generated/graphql";
import { Box, Button, ButtonProps, Link, Skeleton } from "@chakra-ui/core";
import { CB, FSA, KeyboardBoundAction } from "../common/types";
import { useChord, useChordForAction } from "../utils/hooks";
import KeyboardHint from "../components/KeyboardHint";
import { entityToId } from "../utils/apolloUtils";
import { ValueEditorInput } from "../components/Editor";
import { KataRunner } from "../common/KataRunner";
import { useApolloClient } from "@apollo/client";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { arraysEqual } from "../common/func";
import CardTags from "../components/CardTags";
import { ENGINE_TO_EDITOR_LANGUAGE } from "../common/constants";
import { Markdown } from "../components/Markdown";
import { useRouter } from "next/router";

interface IMarkButtonProps {
  chord: string;
  handler: CB;
}
interface IActionButtonProps {
  action: KeyboardBoundAction;
  handler: CB;
}
const ActionButton: React.FC<IActionButtonProps & ButtonProps> = ({
  action,
  handler,
  children,
  ...props
}) => {
  useChordForAction(action, handler);
  return (
    <Button onClick={handler} {...props}>
      <KeyboardHint action={action}>{children}</KeyboardHint>
    </Button>
  );
};
const MarkButton: React.FC<IMarkButtonProps & ButtonProps> = ({ chord, handler, children }) => {
  useChord(chord, handler, true);
  return (
    <Button onClick={handler}>
      <KeyboardHint hotkey={chord}>{children}</KeyboardHint>
    </Button>
  );
};

function generateStudyState(): IStudyCardState {
  return {
    isRevealed: false,
    startedAt: new Date(),
  };
}

enum StudyActionTypes {
  Reset = "reset",
  RevealCard = "revealCard",
  MarkCard = "markCard",
}

function studyReducer(state: IStudyCardState, action: FSA<StudyActionTypes>): IStudyCardState {
  switch (action.type) {
    case StudyActionTypes.Reset:
      return generateStudyState();
    case StudyActionTypes.RevealCard:
      const { isRevealed, ...rest } = state;
      return {
        isRevealed: true,
        ...rest,
      };
    case StudyActionTypes.MarkCard:
      return generateStudyState();
  }
}

interface IStudyCardState {
  isRevealed: boolean;
  startedAt: Date;
}
interface IStudyCardBaseProps {
  card: CardSnippetFragment;
}
interface IStudyCardProps extends IStudyCardBaseProps {
  onFinish: CB;
}
interface IStudyCardFullProps extends IStudyCardBaseProps {
  fetching: boolean;
  showAfterReveal?: string;
  hideAfterReveal?: string;
  isRevealed: boolean;
  report: (result: AttemptResult) => Promise<void>;
  reset: CB;

  markWrong: CB;
  markHard: CB;
  markEasy: CB;
  reveal: CB;
}

type ClozeItem = string | [string, number];
type Cloze = Array<ClozeItem>;

type CompletionItem = {
  kind: "static" | "complete";
  value: string;
};
type Completion = Array<CompletionItem>;

function parseCompletions(completionsText: string): Completion {
  const simpleMatcher = /(\{\{c::.*?\}\})/gmu;
  const extractionMatcher = /\{\{c::(.*?)(?:::(.*?))?\}\}/mu;
  const groups = completionsText.split(simpleMatcher);

  return groups.map((g) => {
    const doesMatch = g.match(extractionMatcher);
    if (doesMatch) {
      return {
        kind: "complete",
        value: doesMatch[1],
      };
    } else {
      return {
        kind: "static",
        value: g,
      };
    }
  });
}

function parseCloze(clozeText: string): Cloze {
  const simpleMatcher = /(\{\{c\d+::.*?\}\})/gmu;
  const extractionMatcher = /\{\{c(\d+)::(.*?)(?:::(.*?))?\}\}/mu;

  const groups = clozeText.split(simpleMatcher);
  return groups.map((g) => {
    const doesMatch = g.match(extractionMatcher);
    if (doesMatch) {
      return [doesMatch[2], Number.parseInt(doesMatch[1])];
    } else {
      return g;
    }
  });
}

interface IMarkdownClozeProps {
  cloze: Cloze;
  clozeOver: "all" | "none" | number;
}

const MarkdownCloze = (props: IMarkdownClozeProps) => {
  const renderedItems = props.cloze.map((item: ClozeItem, _) => {
    if (typeof item === "string") {
      return item;
    }

    // render or obscure
    if (props.clozeOver === "none") {
      return item[0];
    } else if (props.clozeOver === "all" || props.clozeOver === item[1]) {
      return "<span>Clozed</span>";
    } else {
      return item[0];
    }
  });

  return (
    <Box>
      <Markdown source={renderedItems.join("")} />
    </Box>
  );
};

interface IMarkdownCompletionsProps {
  completion: Completion;
}

const MarkdownCompletions = ({ completion }: IMarkdownCompletionsProps) => {
  const renderedItems = completion.map(({ kind, value }, i) => {
    if (kind === "complete") {
      return `<span>Complete Me: [${i}]</span>`;
    }
    return value;
  });
  return (
    <Box>
      <Markdown source={renderedItems.join("")} />
    </Box>
  );
};

const StudyClozeCard = (props: IStudyCardFullProps) => {
  const parsedCloze = parseCloze(props.card.frontText);
  return (
    <Box border="1px" rounded="lg" borderColor="gray.500" m="6">
      <Box p="6">
        <MarkdownCloze cloze={parsedCloze} clozeOver={props.isRevealed ? "none" : "all"} />
      </Box>
      <Box display={props.showAfterReveal}>
        <MarkButton isDisabled={props.fetching} chord="1" handler={props.markWrong}>
          Wrong
        </MarkButton>
        <MarkButton isDisabled={props.fetching} chord="2" handler={props.markHard}>
          Hard
        </MarkButton>
        <MarkButton isDisabled={props.fetching} chord="3" handler={props.markEasy}>
          Easy
        </MarkButton>
        <Box>
          <CardTags tags={props.card.tags} />
        </Box>
      </Box>
      <Box display={props.hideAfterReveal}>
        <ActionButton action={KeyboardBoundAction.RevealCard} handler={props.reveal}>
          Show
        </ActionButton>
        <Box>
          <CardTags tags={props.card.tags} />
        </Box>
      </Box>
    </Box>
  );
};

const StudyCompletionCard = (props: IStudyCardFullProps) => {
  const parsedCompletions = parseCompletions(props.card.frontText);
  const completions = parsedCompletions
    .filter(({ kind }) => kind === "complete")
    .map(({ value }) => value);
  const initialValues = completions.map((v) => "");

  const onSubmit = useCallback(
    async (formValues) => {
      const isCorrect = arraysEqual(completions, formValues.completions);
      await props.report(isCorrect ? AttemptResult.Easy : AttemptResult.Failure);
    },
    [props.card.id, props.report]
  );

  return (
    <Box border="1px" rounded="lg" borderColor="gray.500" m="6">
      <Box p="6">
        <MarkdownCompletions completion={parsedCompletions} />
      </Box>
      <Formik initialValues={{ completions: initialValues }} onSubmit={onSubmit}>
        {({ submitForm }) => {
          return (
            <Form>
              {completions.map((c, i) => {
                return (
                  <InputField
                    key={i}
                    name={`completions[${i}]`}
                    placeholder={`Response for completion ${i + 1}`}
                    label={`Completion ${i + 1}`}
                  />
                );
              })}
              <ActionButton
                handler={submitForm}
                action={KeyboardBoundAction.RevealCard}
                isLoading={props.fetching}
                type="submit"
              >
                Submit
              </ActionButton>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

const StudyFrontAndBackCard = (props: IStudyCardFullProps) => {
  return (
    <Box border="1px" rounded="lg" borderColor="gray.500" m="6">
      <Box p="6">
        <Box>
          <Markdown source={props.card.frontText} />
        </Box>
        <Box display={props.showAfterReveal}>
          <Markdown source={props.card.rearText} />
        </Box>
      </Box>
      <Box display={props.showAfterReveal}>
        <MarkButton isDisabled={props.fetching} chord="1" handler={props.markWrong}>
          Wrong
        </MarkButton>
        <MarkButton isDisabled={props.fetching} chord="2" handler={props.markHard}>
          Hard
        </MarkButton>
        <MarkButton isDisabled={props.fetching} chord="3" handler={props.markEasy}>
          Easy
        </MarkButton>
        <Box>
          <CardTags tags={props.card.tags} />
        </Box>
      </Box>
      <Box display={props.hideAfterReveal}>
        <ActionButton
          isLoading={props.fetching}
          action={KeyboardBoundAction.RevealCard}
          handler={props.reveal}
        >
          Show
        </ActionButton>
        <Box>
          <CardTags tags={props.card.tags} />
        </Box>
      </Box>
    </Box>
  );
};

type KataTestItem = {
  name: string;
  succeeded: boolean;
  message: string | null;
};
interface IKataTestsProps {
  tests: Array<KataTestItem>;
}
const KataTests = ({ tests }: IKataTestsProps) => {
  return (
    <ol>
      {tests.map((testItem, i) => {
        return (
          <li key={i}>
            <span>{testItem.name}</span>
            <span>{testItem.succeeded ? "✓" : "✗"}</span>
            <span>{testItem.message || ""}</span>
          </li>
        );
      })}
    </ol>
  );
};

interface IKataResultProps {
  result: AttemptResult;
  resultText: string;
}
const KataResult = ({ result, resultText }: IKataResultProps) => {
  switch (result) {
    case AttemptResult.Timeout:
      return <div>Code timed out.</div>;
    case AttemptResult.Exception:
      return <div>Exception: {resultText}</div>;
    case AttemptResult.Failure:
      return (
        <div>
          Incorrect
          <KataTests tests={JSON.parse(resultText)} />
        </div>
      );
    case AttemptResult.Easy:
      return (
        <div>
          Correct
          <KataTests tests={JSON.parse(resultText)} />
        </div>
      );

    default:
      return null;
  }
};

const StudyKataCard = (props: IStudyCardFullProps) => {
  const [editorText, setEditorText] = useState(props.card.frontText);

  const [attemptKata, { loading: attemptFetching }] = useAttemptKataMutation();
  const [reportAttempt, { loading: reportFetching }] = useReportAttemptMutation();
  const [attemptResult, setAttemptResult] = useState<
    Omit<AttemptKataMutation["attemptKata"]["cardAttempt"], "id"> | null
  >(null);

  const anyFetching = props.fetching || attemptFetching || reportFetching;

  const makeAttempt = useCallback(
    async (clickEvent: React.MouseEvent) => {
      let attempt;

      if (props.card.engine === EvaluationEngine.Localjavascript) {
        // Run the javascript locally and then we will determine if they passed.
        const runner = new KataRunner(editorText);
        const runData = await runner.run();

        const reportResponse = await reportAttempt({
          variables: {
            input: {
              cardId: props.card.id,
              ...runData,
            },
          },
        });
        attempt = reportResponse.data?.reportAttempt.cardAttempt;
      } else {
        // the kata is remote, we need to send it to the server
        const attemptResponse = await attemptKata({
          variables: {
            input: {
              cardId: props.card.id,
              evaluationEngine: props.card.engine,
              guess: editorText,
            },
          },
        });
        attempt = attemptResponse.data?.attemptKata.cardAttempt;
      }

      if (attempt) {
        setAttemptResult(attempt);
      }
    },
    [editorText, props.card.id]
  );

  const language = ENGINE_TO_EDITOR_LANGUAGE[props.card.engine];
  let showResult;
  let controls;
  if (attemptResult !== null) {
    showResult = <KataResult {...attemptResult} />;
    controls = (
      <Box>
        <ActionButton
          isLoading={anyFetching}
          action={KeyboardBoundAction.Submit}
          handler={props.reset}
        >
          Next
        </ActionButton>
        <Box>
          <CardTags tags={props.card.tags} />
        </Box>
      </Box>
    );
  } else {
    controls = (
      <Box>
        <ActionButton
          isLoading={anyFetching}
          action={KeyboardBoundAction.RevealCard}
          handler={makeAttempt}
        >
          Submit
        </ActionButton>
        <Box>
          <CardTags tags={props.card.tags} />
        </Box>
      </Box>
    );
  }

  return (
    <Box border="1px" rounded="lg" borderColor="gray.500" m="6">
      <Box p="6">
        <ValueEditorInput
          language={language}
          isVisible={true}
          value={editorText}
          onChange={setEditorText}
        />
      </Box>
      {showResult}
      {controls}
    </Box>
  );
};

const StudyCard = ({ card, onFinish }: IStudyCardProps) => {
  const [report, { loading: fetching }] = useReportAttemptMutation();
  const [state, dispatch] = useReducer(studyReducer, generateStudyState());
  const [showAfterReveal, hideAfterReveal] = state.isRevealed
    ? [undefined, "none"]
    : ["none", undefined];
  const apolloClient = useApolloClient();

  const reveal = useCallback(() => dispatch({ type: StudyActionTypes.RevealCard }), [dispatch]);

  const reset = useCallback(() => {
    const cache = apolloClient.cache;
    cache.evict({ fieldName: "cardsDue{}" });
    cache.evict({ id: entityToId(card) });

    dispatch({ type: StudyActionTypes.Reset });
    onFinish();
  }, [dispatch, card.id, apolloClient, onFinish]);

  const reportAttempt = useCallback(
    async (result: AttemptResult) => {
      const input = {
        cardId: card.id,
        result,
        resultText: "",
        timeBeforeResponding: new Date().getTime() - state.startedAt.getTime(),
      };

      const response = await report({
        variables: { input },
        update: (cache, { data }) => {
          reset();
        },
      });
      dispatch({ type: StudyActionTypes.Reset });
    },
    [card.id, state.startedAt, reset]
  );

  const markWrong = useCallback(() => reportAttempt(AttemptResult.Failure), [reportAttempt]);
  const markHard = useCallback(() => reportAttempt(AttemptResult.Hard), [reportAttempt]);
  const markEasy = useCallback(() => reportAttempt(AttemptResult.Easy), [reportAttempt]);

  const COMPONENT_MAPPING = {
    [CardKind.Frontandback]: StudyFrontAndBackCard,
    [CardKind.Cloze]: StudyClozeCard,
    [CardKind.Kata]: StudyKataCard,
    [CardKind.Completion]: StudyCompletionCard,
  };
  const InnerComponent = COMPONENT_MAPPING[card.kind];

  return (
    <InnerComponent
      card={card}
      {...state}
      fetching={fetching}
      markEasy={markEasy}
      markHard={markHard}
      markWrong={markWrong}
      isRevealed={state.isRevealed}
      reveal={reveal}
      reset={reset}
      report={reportAttempt}
      showAfterReveal={showAfterReveal}
      hideAfterReveal={hideAfterReveal}
    />
  );
};

const Learn = () => {
  const router = useRouter();
  const cardsDue = useCardsDueQuery({ variables: { first: 20 } });
  const cards = cardsDue.data?.cardsDue?.nodes;

  const fetchCards = useCallback(() => {
    if ((cardsDue.data?.cardsDue?.nodes?.length || 0) < 5) {
      cardsDue.refetch();
    }
  }, [cardsDue]);

  const firstCard = cards?.[0];

  const navigateToEditPage = useCallback(() => {
    if (firstCard) {
      router.push(`/card/${firstCard.id}/`);
    }
  }, [(firstCard || { id: null }).id]);

  useChord("e", navigateToEditPage, true);

  if (firstCard) {
    return (
      <>
        <KeyboardHint hotkey="e" zIndex={10}>
          <span>
            <NextLink href={`card/${firstCard.id}`}>
              <Button as={Link}>Edit</Button>
            </NextLink>
          </span>
        </KeyboardHint>
        <StudyCard card={firstCard} onFinish={fetchCards} />
      </>
    );
  } else {
    return <Skeleton width="100%" height="100%" />;
  }
};

export default Learn;
