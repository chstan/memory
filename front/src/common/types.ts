import { InMemoryCache } from "@apollo/client";

export type CB = (...args: any[]) => void;
export type ValueHandler<T> = (v: T) => void;

export type SelectOption<T> = {
  value: T,
  label: string,
  __isNew__?: boolean,
}

export type FSA<ActionT> = {
  type: ActionT;
  payload?: any;
}

export type ApolloResolver = (parent: any, args: any, { cache }: { cache: InMemoryCache }) => any;

export enum KeyboardBoundAction {
  RevealCard = "revealCard",
  MarkCardFailed = "cardWasFailed",
  MarkCardHard = "cardWasHard",
  MarkCardEasy = "cardWasEasy",
  AddCardPopup = "addCardPopup",
  EditCard = "editCard",

  Submit = "submit",

  NavigateToStudy = "navigateToStudy",
  NavigateToDashboard = "navigateToDashboard",
  NavigateToProfile = "navigateToProfile",
};

export const NAVIGATION_URLS = {
  [KeyboardBoundAction.NavigateToStudy]: "/study/",
  [KeyboardBoundAction.NavigateToDashboard]: "/dashboard/",
  [KeyboardBoundAction.NavigateToProfile]: "/profile/",
};




