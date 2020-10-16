import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: any;
  /** The multiplier path scalar represents a valid GraphQL multiplier path string. */
  MultiplierPath: any;
  PaginationAmount: any;
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: any;
};

export type Query = {
  __typename?: 'Query';
  card: Card;
  cardsDue?: Maybe<CardConnection>;
  me: User;
  tags?: Maybe<TagConnection>;
};


export type QueryCardArgs = {
  input: GetCardInput;
};


export type QueryCardsDueArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['PaginationAmount']>;
  last?: Maybe<Scalars['PaginationAmount']>;
  order_by?: Maybe<CardSort>;
  where?: Maybe<CardFilter>;
};


export type QueryTagsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['PaginationAmount']>;
  last?: Maybe<Scalars['PaginationAmount']>;
  order_by?: Maybe<TagSort>;
  where?: Maybe<TagFilter>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCard: CardPayloadBase;
  addUser: AddUserPayload;
  attemptKata: CardAttemptPayload;
  deleteCard: PayloadBase;
  login: LoginPayload;
  logout: Scalars['Boolean'];
  reportAttempt: CardAttemptPayload;
  updateCard: CardPayloadBase;
  updateReviewSettings: UserSettingsPayload;
};


export type MutationAddCardArgs = {
  input: AddCardInput;
};


export type MutationAddUserArgs = {
  input: AddUserInput;
};


export type MutationAttemptKataArgs = {
  input: AttemptKataInput;
};


export type MutationDeleteCardArgs = {
  input: DeleteCardInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationReportAttemptArgs = {
  input: ReportAttemptInput;
};


export type MutationUpdateCardArgs = {
  input: UpdateCardInput;
};


export type MutationUpdateReviewSettingsArgs = {
  input: UpdateReviewSettingsInput;
};


export enum CardKind {
  Cloze = 'CLOZE',
  Frontandback = 'FRONTANDBACK',
  Completion = 'COMPLETION',
  Kata = 'KATA'
}

export enum EvaluationEngine {
  Python = 'PYTHON',
  Localjavascript = 'LOCALJAVASCRIPT'
}

export enum AttemptResult {
  Exception = 'EXCEPTION',
  Timeout = 'TIMEOUT',
  Failure = 'FAILURE',
  Hard = 'HARD',
  Easy = 'EASY'
}


export type ReviewHistory = {
  __typename?: 'ReviewHistory';
  lastMonth: ReviewStatistic;
  lastWeek: ReviewStatistic;
  lastYear: ReviewStatistic;
  today: ReviewStatistic;
};

export type ReviewStatistic = {
  __typename?: 'ReviewStatistic';
  correctFraction: Scalars['Float'];
  reviewCount: Scalars['Int'];
};

export type UserSettings = {
  __typename?: 'UserSettings';
  id: Scalars['Int'];
  maxReviewsPerDay: Scalars['Long'];
  newCardDensity: Scalars['Float'];
  user?: Maybe<User>;
};

export type Card = {
  __typename?: 'Card';
  cardAttempts?: Maybe<Array<Maybe<CardAttempt>>>;
  clozeItem: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  creator?: Maybe<User>;
  dueAt: Scalars['DateTime'];
  ease: Scalars['Float'];
  engine: EvaluationEngine;
  frontText: Scalars['String'];
  id: Scalars['Int'];
  interval: Scalars['DateTime'];
  isActive?: Maybe<Scalars['Boolean']>;
  kind: CardKind;
  rearText: Scalars['String'];
  tags: Array<Tag>;
  updatedAt: Scalars['DateTime'];
};

export type CardFilter = {
  AND?: Maybe<Array<CardFilter>>;
  clozeItem?: Maybe<Scalars['Int']>;
  clozeItem_gt?: Maybe<Scalars['Int']>;
  clozeItem_gte?: Maybe<Scalars['Int']>;
  clozeItem_in?: Maybe<Array<Scalars['Int']>>;
  clozeItem_lt?: Maybe<Scalars['Int']>;
  clozeItem_lte?: Maybe<Scalars['Int']>;
  clozeItem_not?: Maybe<Scalars['Int']>;
  clozeItem_not_gt?: Maybe<Scalars['Int']>;
  clozeItem_not_gte?: Maybe<Scalars['Int']>;
  clozeItem_not_in?: Maybe<Array<Scalars['Int']>>;
  clozeItem_not_lt?: Maybe<Scalars['Int']>;
  clozeItem_not_lte?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdAt_gt?: Maybe<Scalars['DateTime']>;
  createdAt_gte?: Maybe<Scalars['DateTime']>;
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>;
  createdAt_lt?: Maybe<Scalars['DateTime']>;
  createdAt_lte?: Maybe<Scalars['DateTime']>;
  createdAt_not?: Maybe<Scalars['DateTime']>;
  createdAt_not_gt?: Maybe<Scalars['DateTime']>;
  createdAt_not_gte?: Maybe<Scalars['DateTime']>;
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>;
  createdAt_not_lt?: Maybe<Scalars['DateTime']>;
  createdAt_not_lte?: Maybe<Scalars['DateTime']>;
  dueAt?: Maybe<Scalars['DateTime']>;
  dueAt_gt?: Maybe<Scalars['DateTime']>;
  dueAt_gte?: Maybe<Scalars['DateTime']>;
  dueAt_in?: Maybe<Array<Scalars['DateTime']>>;
  dueAt_lt?: Maybe<Scalars['DateTime']>;
  dueAt_lte?: Maybe<Scalars['DateTime']>;
  dueAt_not?: Maybe<Scalars['DateTime']>;
  dueAt_not_gt?: Maybe<Scalars['DateTime']>;
  dueAt_not_gte?: Maybe<Scalars['DateTime']>;
  dueAt_not_in?: Maybe<Array<Scalars['DateTime']>>;
  dueAt_not_lt?: Maybe<Scalars['DateTime']>;
  dueAt_not_lte?: Maybe<Scalars['DateTime']>;
  ease?: Maybe<Scalars['Float']>;
  ease_gt?: Maybe<Scalars['Float']>;
  ease_gte?: Maybe<Scalars['Float']>;
  ease_in?: Maybe<Array<Scalars['Float']>>;
  ease_lt?: Maybe<Scalars['Float']>;
  ease_lte?: Maybe<Scalars['Float']>;
  ease_not?: Maybe<Scalars['Float']>;
  ease_not_gt?: Maybe<Scalars['Float']>;
  ease_not_gte?: Maybe<Scalars['Float']>;
  ease_not_in?: Maybe<Array<Scalars['Float']>>;
  ease_not_lt?: Maybe<Scalars['Float']>;
  ease_not_lte?: Maybe<Scalars['Float']>;
  engine?: Maybe<EvaluationEngine>;
  engine_gt?: Maybe<EvaluationEngine>;
  engine_gte?: Maybe<EvaluationEngine>;
  engine_in?: Maybe<Array<EvaluationEngine>>;
  engine_lt?: Maybe<EvaluationEngine>;
  engine_lte?: Maybe<EvaluationEngine>;
  engine_not?: Maybe<EvaluationEngine>;
  engine_not_gt?: Maybe<EvaluationEngine>;
  engine_not_gte?: Maybe<EvaluationEngine>;
  engine_not_in?: Maybe<Array<EvaluationEngine>>;
  engine_not_lt?: Maybe<EvaluationEngine>;
  engine_not_lte?: Maybe<EvaluationEngine>;
  frontText?: Maybe<Scalars['String']>;
  frontText_contains?: Maybe<Scalars['String']>;
  frontText_ends_with?: Maybe<Scalars['String']>;
  frontText_in?: Maybe<Array<Scalars['String']>>;
  frontText_not?: Maybe<Scalars['String']>;
  frontText_not_contains?: Maybe<Scalars['String']>;
  frontText_not_ends_with?: Maybe<Scalars['String']>;
  frontText_not_in?: Maybe<Array<Scalars['String']>>;
  frontText_not_starts_with?: Maybe<Scalars['String']>;
  frontText_starts_with?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  id_gt?: Maybe<Scalars['Int']>;
  id_gte?: Maybe<Scalars['Int']>;
  id_in?: Maybe<Array<Scalars['Int']>>;
  id_lt?: Maybe<Scalars['Int']>;
  id_lte?: Maybe<Scalars['Int']>;
  id_not?: Maybe<Scalars['Int']>;
  id_not_gt?: Maybe<Scalars['Int']>;
  id_not_gte?: Maybe<Scalars['Int']>;
  id_not_in?: Maybe<Array<Scalars['Int']>>;
  id_not_lt?: Maybe<Scalars['Int']>;
  id_not_lte?: Maybe<Scalars['Int']>;
  interval?: Maybe<Scalars['DateTime']>;
  interval_gt?: Maybe<Scalars['DateTime']>;
  interval_gte?: Maybe<Scalars['DateTime']>;
  interval_in?: Maybe<Array<Scalars['DateTime']>>;
  interval_lt?: Maybe<Scalars['DateTime']>;
  interval_lte?: Maybe<Scalars['DateTime']>;
  interval_not?: Maybe<Scalars['DateTime']>;
  interval_not_gt?: Maybe<Scalars['DateTime']>;
  interval_not_gte?: Maybe<Scalars['DateTime']>;
  interval_not_in?: Maybe<Array<Scalars['DateTime']>>;
  interval_not_lt?: Maybe<Scalars['DateTime']>;
  interval_not_lte?: Maybe<Scalars['DateTime']>;
  isActive?: Maybe<Scalars['Boolean']>;
  isActive_not?: Maybe<Scalars['Boolean']>;
  kind?: Maybe<CardKind>;
  kind_gt?: Maybe<CardKind>;
  kind_gte?: Maybe<CardKind>;
  kind_in?: Maybe<Array<CardKind>>;
  kind_lt?: Maybe<CardKind>;
  kind_lte?: Maybe<CardKind>;
  kind_not?: Maybe<CardKind>;
  kind_not_gt?: Maybe<CardKind>;
  kind_not_gte?: Maybe<CardKind>;
  kind_not_in?: Maybe<Array<CardKind>>;
  kind_not_lt?: Maybe<CardKind>;
  kind_not_lte?: Maybe<CardKind>;
  OR?: Maybe<Array<CardFilter>>;
  rearText?: Maybe<Scalars['String']>;
  rearText_contains?: Maybe<Scalars['String']>;
  rearText_ends_with?: Maybe<Scalars['String']>;
  rearText_in?: Maybe<Array<Scalars['String']>>;
  rearText_not?: Maybe<Scalars['String']>;
  rearText_not_contains?: Maybe<Scalars['String']>;
  rearText_not_ends_with?: Maybe<Scalars['String']>;
  rearText_not_in?: Maybe<Array<Scalars['String']>>;
  rearText_not_starts_with?: Maybe<Scalars['String']>;
  rearText_starts_with?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedAt_gt?: Maybe<Scalars['DateTime']>;
  updatedAt_gte?: Maybe<Scalars['DateTime']>;
  updatedAt_in?: Maybe<Array<Scalars['DateTime']>>;
  updatedAt_lt?: Maybe<Scalars['DateTime']>;
  updatedAt_lte?: Maybe<Scalars['DateTime']>;
  updatedAt_not?: Maybe<Scalars['DateTime']>;
  updatedAt_not_gt?: Maybe<Scalars['DateTime']>;
  updatedAt_not_gte?: Maybe<Scalars['DateTime']>;
  updatedAt_not_in?: Maybe<Array<Scalars['DateTime']>>;
  updatedAt_not_lt?: Maybe<Scalars['DateTime']>;
  updatedAt_not_lte?: Maybe<Scalars['DateTime']>;
};

export type CardSort = {
  clozeItem?: Maybe<SortOperationKind>;
  createdAt?: Maybe<SortOperationKind>;
  dueAt?: Maybe<SortOperationKind>;
  ease?: Maybe<SortOperationKind>;
  engine?: Maybe<SortOperationKind>;
  frontText?: Maybe<SortOperationKind>;
  id?: Maybe<SortOperationKind>;
  interval?: Maybe<SortOperationKind>;
  isActive?: Maybe<SortOperationKind>;
  kind?: Maybe<SortOperationKind>;
  rearText?: Maybe<SortOperationKind>;
  updatedAt?: Maybe<SortOperationKind>;
};

/** A connection to a list of items. */
export type CardConnection = {
  __typename?: 'CardConnection';
  /** A list of edges. */
  edges?: Maybe<Array<CardEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Maybe<Card>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A connection to a list of items. */
export type TagConnection = {
  __typename?: 'TagConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TagEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Maybe<Tag>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};


export type Tag = {
  __typename?: 'Tag';
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
};

export type TagFilter = {
  AND?: Maybe<Array<TagFilter>>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdAt_gt?: Maybe<Scalars['DateTime']>;
  createdAt_gte?: Maybe<Scalars['DateTime']>;
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>;
  createdAt_lt?: Maybe<Scalars['DateTime']>;
  createdAt_lte?: Maybe<Scalars['DateTime']>;
  createdAt_not?: Maybe<Scalars['DateTime']>;
  createdAt_not_gt?: Maybe<Scalars['DateTime']>;
  createdAt_not_gte?: Maybe<Scalars['DateTime']>;
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>;
  createdAt_not_lt?: Maybe<Scalars['DateTime']>;
  createdAt_not_lte?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  description_contains?: Maybe<Scalars['String']>;
  description_ends_with?: Maybe<Scalars['String']>;
  description_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  description_not?: Maybe<Scalars['String']>;
  description_not_contains?: Maybe<Scalars['String']>;
  description_not_ends_with?: Maybe<Scalars['String']>;
  description_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  description_not_starts_with?: Maybe<Scalars['String']>;
  description_starts_with?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  id_gt?: Maybe<Scalars['Int']>;
  id_gte?: Maybe<Scalars['Int']>;
  id_in?: Maybe<Array<Scalars['Int']>>;
  id_lt?: Maybe<Scalars['Int']>;
  id_lte?: Maybe<Scalars['Int']>;
  id_not?: Maybe<Scalars['Int']>;
  id_not_gt?: Maybe<Scalars['Int']>;
  id_not_gte?: Maybe<Scalars['Int']>;
  id_not_in?: Maybe<Array<Scalars['Int']>>;
  id_not_lt?: Maybe<Scalars['Int']>;
  id_not_lte?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  name_contains?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  name_not?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  name_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  OR?: Maybe<Array<TagFilter>>;
};

export type TagSort = {
  createdAt?: Maybe<SortOperationKind>;
  description?: Maybe<SortOperationKind>;
  id?: Maybe<SortOperationKind>;
  name?: Maybe<SortOperationKind>;
};

export enum SortOperationKind {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/** An edge in a connection. */
export type CardEdge = {
  __typename?: 'CardEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<Card>;
};

/** An edge in a connection. */
export type TagEdge = {
  __typename?: 'TagEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<Tag>;
};

export type User = {
  __typename?: 'User';
  cardsDueCount: Scalars['Int'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['Int'];
  katasDueCount: Scalars['Int'];
  lastName: Scalars['String'];
  reviewHistory: ReviewHistory;
  settings: UserSettings;
  settingsId: Scalars['Int'];
};

export type GetCardInput = {
  cardId: Scalars['Int'];
};

export type AddUserPayload = {
  __typename?: 'AddUserPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  user: User;
};

export type AddUserInput = {
  clientMutationId?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type LoginInput = {
  clientMutationId?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginPayload = {
  __typename?: 'LoginPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  loggedInUser: User;
  scheme: Scalars['String'];
  token: Scalars['String'];
};

export type CardPayloadBase = {
  __typename?: 'CardPayloadBase';
  card?: Maybe<Card>;
  clientMutationId?: Maybe<Scalars['String']>;
  errors: Array<UserError>;
};

export type AddCardInput = {
  clientMutationId?: Maybe<Scalars['String']>;
  engine: EvaluationEngine;
  frontText: Scalars['String'];
  kind: CardKind;
  newTags: Array<Maybe<Scalars['String']>>;
  rearText: Scalars['String'];
  tagIds: Array<Scalars['Int']>;
};

export type ReportAttemptInput = {
  cardId: Scalars['Int'];
  clientMutationId?: Maybe<Scalars['String']>;
  result: AttemptResult;
  resultText: Scalars['String'];
  timeBeforeResponding: Scalars['Float'];
};

export type AttemptKataInput = {
  cardId: Scalars['Int'];
  clientMutationId?: Maybe<Scalars['String']>;
  evaluationEngine: EvaluationEngine;
  guess: Scalars['String'];
};

export type DeleteCardInput = {
  cardId: Scalars['Int'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateCardInput = {
  cardId: Scalars['Int'];
  clientMutationId?: Maybe<Scalars['String']>;
  engine: EvaluationEngine;
  frontText: Scalars['String'];
  kind: CardKind;
  newTags: Array<Maybe<Scalars['String']>>;
  rearText: Scalars['String'];
  tagIds: Array<Scalars['Int']>;
};

export type CardAttemptPayload = {
  __typename?: 'CardAttemptPayload';
  cardAttempt: CardAttempt;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type PayloadBase = {
  __typename?: 'PayloadBase';
  clientMutationId?: Maybe<Scalars['String']>;
  errors: Array<UserError>;
};

export type UserSettingsPayload = {
  __typename?: 'UserSettingsPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  settings: UserSettings;
};

export type UpdateReviewSettingsInput = {
  clientMutationId?: Maybe<Scalars['String']>;
  maxReviewsPerDay: Scalars['Int'];
  newCardDensity: Scalars['Float'];
};


export type CardAttempt = {
  __typename?: 'CardAttempt';
  attemptedAt: Scalars['DateTime'];
  card?: Maybe<Card>;
  id: Scalars['Int'];
  result: AttemptResult;
  resultText: Scalars['String'];
  timeBeforeResponding: Scalars['DateTime'];
  user?: Maybe<User>;
};

export type UserError = {
  __typename?: 'UserError';
  code: Scalars['String'];
  message: Scalars['String'];
};

export type CardAttemptSnippetFragment = (
  { __typename?: 'CardAttempt' }
  & Pick<CardAttempt, 'id' | 'result' | 'resultText'>
);

export type CardSnippetFragment = (
  { __typename: 'Card' }
  & Pick<Card, 'id' | 'kind' | 'createdAt' | 'updatedAt' | 'frontText' | 'rearText' | 'dueAt' | 'engine'>
  & { tags: Array<(
    { __typename?: 'Tag' }
    & TagSnippetFragment
  )>, creator?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  )> }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email'>
);

export type ReviewStatisticSnippetFragment = (
  { __typename?: 'ReviewStatistic' }
  & Pick<ReviewStatistic, 'correctFraction' | 'reviewCount'>
);

export type TagSnippetFragment = (
  { __typename: 'Tag' }
  & Pick<Tag, 'id' | 'name'>
);

export type UserSettingsSnippetFragment = (
  { __typename?: 'UserSettings' }
  & Pick<UserSettings, 'newCardDensity' | 'maxReviewsPerDay'>
);

export type AddCardMutationVariables = Exact<{
  input: AddCardInput;
}>;


export type AddCardMutation = (
  { __typename?: 'Mutation' }
  & { addCard: (
    { __typename?: 'CardPayloadBase' }
    & { card?: Maybe<(
      { __typename?: 'Card' }
      & CardSnippetFragment
    )> }
  ) }
);

export type AddUserMutationVariables = Exact<{
  input: AddUserInput;
}>;


export type AddUserMutation = (
  { __typename?: 'Mutation' }
  & { addUser: (
    { __typename?: 'AddUserPayload' }
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id'>
    ) }
  ) }
);

export type AttemptKataMutationVariables = Exact<{
  input: AttemptKataInput;
}>;


export type AttemptKataMutation = (
  { __typename?: 'Mutation' }
  & { attemptKata: (
    { __typename?: 'CardAttemptPayload' }
    & { cardAttempt: (
      { __typename?: 'CardAttempt' }
      & CardAttemptSnippetFragment
    ) }
  ) }
);

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginPayload' }
    & Pick<LoginPayload, 'token'>
    & { loggedInUser: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
    ) }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type ReportAttemptMutationVariables = Exact<{
  input: ReportAttemptInput;
}>;


export type ReportAttemptMutation = (
  { __typename?: 'Mutation' }
  & { reportAttempt: (
    { __typename?: 'CardAttemptPayload' }
    & { cardAttempt: (
      { __typename?: 'CardAttempt' }
      & CardAttemptSnippetFragment
    ) }
  ) }
);

export type UpdateCardMutationVariables = Exact<{
  input: UpdateCardInput;
}>;


export type UpdateCardMutation = (
  { __typename?: 'Mutation' }
  & { updateCard: (
    { __typename?: 'CardPayloadBase' }
    & { card?: Maybe<(
      { __typename?: 'Card' }
      & CardSnippetFragment
    )> }
  ) }
);

export type UpdateReviewSettingsMutationVariables = Exact<{
  input: UpdateReviewSettingsInput;
}>;


export type UpdateReviewSettingsMutation = (
  { __typename?: 'Mutation' }
  & { updateReviewSettings: (
    { __typename?: 'UserSettingsPayload' }
    & { settings: (
      { __typename?: 'UserSettings' }
      & UserSettingsSnippetFragment
    ) }
  ) }
);

export type CardDetailQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CardDetailQuery = (
  { __typename?: 'Query' }
  & { card: (
    { __typename?: 'Card' }
    & CardSnippetFragment
  ) }
);

export type CardsDueQueryVariables = Exact<{
  first?: Maybe<Scalars['PaginationAmount']>;
}>;


export type CardsDueQuery = (
  { __typename?: 'Query' }
  & { cardsDue?: Maybe<(
    { __typename?: 'CardConnection' }
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'startCursor' | 'endCursor' | 'hasNextPage' | 'hasPreviousPage'>
    ), nodes?: Maybe<Array<Maybe<(
      { __typename?: 'Card' }
      & CardSnippetFragment
    )>>> }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'cardsDueCount' | 'katasDueCount'>
    & { settings: (
      { __typename?: 'UserSettings' }
      & Pick<UserSettings, 'maxReviewsPerDay' | 'newCardDensity'>
    ) }
  ) }
);

export type ProfileInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileInfoQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'cardsDueCount' | 'katasDueCount'>
    & { reviewHistory: (
      { __typename?: 'ReviewHistory' }
      & { today: (
        { __typename?: 'ReviewStatistic' }
        & ReviewStatisticSnippetFragment
      ), lastWeek: (
        { __typename?: 'ReviewStatistic' }
        & ReviewStatisticSnippetFragment
      ), lastMonth: (
        { __typename?: 'ReviewStatistic' }
        & ReviewStatisticSnippetFragment
      ), lastYear: (
        { __typename?: 'ReviewStatistic' }
        & ReviewStatisticSnippetFragment
      ) }
    ), settings: (
      { __typename?: 'UserSettings' }
      & UserSettingsSnippetFragment
    ) }
  ) }
);

export type TagsQueryVariables = Exact<{
  tagName?: Maybe<Scalars['String']>;
}>;


export type TagsQuery = (
  { __typename?: 'Query' }
  & { tags?: Maybe<(
    { __typename?: 'TagConnection' }
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'startCursor' | 'endCursor' | 'hasNextPage' | 'hasPreviousPage'>
    ), nodes?: Maybe<Array<Maybe<(
      { __typename?: 'Tag' }
      & TagSnippetFragment
    )>>> }
  )> }
);

export const CardAttemptSnippetFragmentDoc = gql`
    fragment CardAttemptSnippet on CardAttempt {
  id
  result
  resultText
}
    `;
export const TagSnippetFragmentDoc = gql`
    fragment TagSnippet on Tag {
  id
  name
  __typename
}
    `;
export const CardSnippetFragmentDoc = gql`
    fragment CardSnippet on Card {
  id
  kind
  createdAt
  updatedAt
  frontText
  rearText
  dueAt
  engine
  __typename
  tags {
    ...TagSnippet
  }
  creator {
    id
    email
  }
}
    ${TagSnippetFragmentDoc}`;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  email
}
    `;
export const ReviewStatisticSnippetFragmentDoc = gql`
    fragment ReviewStatisticSnippet on ReviewStatistic {
  correctFraction
  reviewCount
}
    `;
export const UserSettingsSnippetFragmentDoc = gql`
    fragment UserSettingsSnippet on UserSettings {
  newCardDensity
  maxReviewsPerDay
}
    `;
export const AddCardDocument = gql`
    mutation AddCard($input: AddCardInput!) {
  addCard(input: $input) {
    card {
      ...CardSnippet
    }
  }
}
    ${CardSnippetFragmentDoc}`;
export type AddCardMutationFn = Apollo.MutationFunction<AddCardMutation, AddCardMutationVariables>;

/**
 * __useAddCardMutation__
 *
 * To run a mutation, you first call `useAddCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCardMutation, { data, loading, error }] = useAddCardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddCardMutation(baseOptions?: Apollo.MutationHookOptions<AddCardMutation, AddCardMutationVariables>) {
        return Apollo.useMutation<AddCardMutation, AddCardMutationVariables>(AddCardDocument, baseOptions);
      }
export type AddCardMutationHookResult = ReturnType<typeof useAddCardMutation>;
export type AddCardMutationResult = Apollo.MutationResult<AddCardMutation>;
export type AddCardMutationOptions = Apollo.BaseMutationOptions<AddCardMutation, AddCardMutationVariables>;
export const AddUserDocument = gql`
    mutation addUser($input: AddUserInput!) {
  addUser(input: $input) {
    user {
      id
    }
  }
}
    `;
export type AddUserMutationFn = Apollo.MutationFunction<AddUserMutation, AddUserMutationVariables>;

/**
 * __useAddUserMutation__
 *
 * To run a mutation, you first call `useAddUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserMutation, { data, loading, error }] = useAddUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddUserMutation(baseOptions?: Apollo.MutationHookOptions<AddUserMutation, AddUserMutationVariables>) {
        return Apollo.useMutation<AddUserMutation, AddUserMutationVariables>(AddUserDocument, baseOptions);
      }
export type AddUserMutationHookResult = ReturnType<typeof useAddUserMutation>;
export type AddUserMutationResult = Apollo.MutationResult<AddUserMutation>;
export type AddUserMutationOptions = Apollo.BaseMutationOptions<AddUserMutation, AddUserMutationVariables>;
export const AttemptKataDocument = gql`
    mutation AttemptKata($input: AttemptKataInput!) {
  attemptKata(input: $input) {
    cardAttempt {
      ...CardAttemptSnippet
    }
  }
}
    ${CardAttemptSnippetFragmentDoc}`;
export type AttemptKataMutationFn = Apollo.MutationFunction<AttemptKataMutation, AttemptKataMutationVariables>;

/**
 * __useAttemptKataMutation__
 *
 * To run a mutation, you first call `useAttemptKataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttemptKataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attemptKataMutation, { data, loading, error }] = useAttemptKataMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAttemptKataMutation(baseOptions?: Apollo.MutationHookOptions<AttemptKataMutation, AttemptKataMutationVariables>) {
        return Apollo.useMutation<AttemptKataMutation, AttemptKataMutationVariables>(AttemptKataDocument, baseOptions);
      }
export type AttemptKataMutationHookResult = ReturnType<typeof useAttemptKataMutation>;
export type AttemptKataMutationResult = Apollo.MutationResult<AttemptKataMutation>;
export type AttemptKataMutationOptions = Apollo.BaseMutationOptions<AttemptKataMutation, AttemptKataMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    loggedInUser {
      id
      email
    }
    token
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const ReportAttemptDocument = gql`
    mutation ReportAttempt($input: ReportAttemptInput!) {
  reportAttempt(input: $input) {
    cardAttempt {
      ...CardAttemptSnippet
    }
  }
}
    ${CardAttemptSnippetFragmentDoc}`;
export type ReportAttemptMutationFn = Apollo.MutationFunction<ReportAttemptMutation, ReportAttemptMutationVariables>;

/**
 * __useReportAttemptMutation__
 *
 * To run a mutation, you first call `useReportAttemptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReportAttemptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reportAttemptMutation, { data, loading, error }] = useReportAttemptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReportAttemptMutation(baseOptions?: Apollo.MutationHookOptions<ReportAttemptMutation, ReportAttemptMutationVariables>) {
        return Apollo.useMutation<ReportAttemptMutation, ReportAttemptMutationVariables>(ReportAttemptDocument, baseOptions);
      }
export type ReportAttemptMutationHookResult = ReturnType<typeof useReportAttemptMutation>;
export type ReportAttemptMutationResult = Apollo.MutationResult<ReportAttemptMutation>;
export type ReportAttemptMutationOptions = Apollo.BaseMutationOptions<ReportAttemptMutation, ReportAttemptMutationVariables>;
export const UpdateCardDocument = gql`
    mutation UpdateCard($input: UpdateCardInput!) {
  updateCard(input: $input) {
    card {
      ...CardSnippet
    }
  }
}
    ${CardSnippetFragmentDoc}`;
export type UpdateCardMutationFn = Apollo.MutationFunction<UpdateCardMutation, UpdateCardMutationVariables>;

/**
 * __useUpdateCardMutation__
 *
 * To run a mutation, you first call `useUpdateCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCardMutation, { data, loading, error }] = useUpdateCardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCardMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCardMutation, UpdateCardMutationVariables>) {
        return Apollo.useMutation<UpdateCardMutation, UpdateCardMutationVariables>(UpdateCardDocument, baseOptions);
      }
export type UpdateCardMutationHookResult = ReturnType<typeof useUpdateCardMutation>;
export type UpdateCardMutationResult = Apollo.MutationResult<UpdateCardMutation>;
export type UpdateCardMutationOptions = Apollo.BaseMutationOptions<UpdateCardMutation, UpdateCardMutationVariables>;
export const UpdateReviewSettingsDocument = gql`
    mutation UpdateReviewSettings($input: UpdateReviewSettingsInput!) {
  updateReviewSettings(input: $input) {
    settings {
      ...UserSettingsSnippet
    }
  }
}
    ${UserSettingsSnippetFragmentDoc}`;
export type UpdateReviewSettingsMutationFn = Apollo.MutationFunction<UpdateReviewSettingsMutation, UpdateReviewSettingsMutationVariables>;

/**
 * __useUpdateReviewSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateReviewSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReviewSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReviewSettingsMutation, { data, loading, error }] = useUpdateReviewSettingsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateReviewSettingsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReviewSettingsMutation, UpdateReviewSettingsMutationVariables>) {
        return Apollo.useMutation<UpdateReviewSettingsMutation, UpdateReviewSettingsMutationVariables>(UpdateReviewSettingsDocument, baseOptions);
      }
export type UpdateReviewSettingsMutationHookResult = ReturnType<typeof useUpdateReviewSettingsMutation>;
export type UpdateReviewSettingsMutationResult = Apollo.MutationResult<UpdateReviewSettingsMutation>;
export type UpdateReviewSettingsMutationOptions = Apollo.BaseMutationOptions<UpdateReviewSettingsMutation, UpdateReviewSettingsMutationVariables>;
export const CardDetailDocument = gql`
    query CardDetail($id: Int!) {
  card(input: {cardId: $id}) {
    ...CardSnippet
  }
}
    ${CardSnippetFragmentDoc}`;

/**
 * __useCardDetailQuery__
 *
 * To run a query within a React component, call `useCardDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCardDetailQuery(baseOptions?: Apollo.QueryHookOptions<CardDetailQuery, CardDetailQueryVariables>) {
        return Apollo.useQuery<CardDetailQuery, CardDetailQueryVariables>(CardDetailDocument, baseOptions);
      }
export function useCardDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardDetailQuery, CardDetailQueryVariables>) {
          return Apollo.useLazyQuery<CardDetailQuery, CardDetailQueryVariables>(CardDetailDocument, baseOptions);
        }
export type CardDetailQueryHookResult = ReturnType<typeof useCardDetailQuery>;
export type CardDetailLazyQueryHookResult = ReturnType<typeof useCardDetailLazyQuery>;
export type CardDetailQueryResult = Apollo.QueryResult<CardDetailQuery, CardDetailQueryVariables>;
export const CardsDueDocument = gql`
    query CardsDue($first: PaginationAmount) {
  cardsDue(first: $first) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...CardSnippet
    }
  }
}
    ${CardSnippetFragmentDoc}`;

/**
 * __useCardsDueQuery__
 *
 * To run a query within a React component, call `useCardsDueQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardsDueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardsDueQuery({
 *   variables: {
 *      first: // value for 'first'
 *   },
 * });
 */
export function useCardsDueQuery(baseOptions?: Apollo.QueryHookOptions<CardsDueQuery, CardsDueQueryVariables>) {
        return Apollo.useQuery<CardsDueQuery, CardsDueQueryVariables>(CardsDueDocument, baseOptions);
      }
export function useCardsDueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardsDueQuery, CardsDueQueryVariables>) {
          return Apollo.useLazyQuery<CardsDueQuery, CardsDueQueryVariables>(CardsDueDocument, baseOptions);
        }
export type CardsDueQueryHookResult = ReturnType<typeof useCardsDueQuery>;
export type CardsDueLazyQueryHookResult = ReturnType<typeof useCardsDueLazyQuery>;
export type CardsDueQueryResult = Apollo.QueryResult<CardsDueQuery, CardsDueQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    cardsDueCount
    katasDueCount
    settings {
      maxReviewsPerDay
      newCardDensity
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const ProfileInfoDocument = gql`
    query ProfileInfo {
  me {
    id
    email
    cardsDueCount
    katasDueCount
    reviewHistory {
      today {
        ...ReviewStatisticSnippet
      }
      lastWeek {
        ...ReviewStatisticSnippet
      }
      lastMonth {
        ...ReviewStatisticSnippet
      }
      lastYear {
        ...ReviewStatisticSnippet
      }
    }
    settings {
      ...UserSettingsSnippet
    }
  }
}
    ${ReviewStatisticSnippetFragmentDoc}
${UserSettingsSnippetFragmentDoc}`;

/**
 * __useProfileInfoQuery__
 *
 * To run a query within a React component, call `useProfileInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useProfileInfoQuery(baseOptions?: Apollo.QueryHookOptions<ProfileInfoQuery, ProfileInfoQueryVariables>) {
        return Apollo.useQuery<ProfileInfoQuery, ProfileInfoQueryVariables>(ProfileInfoDocument, baseOptions);
      }
export function useProfileInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileInfoQuery, ProfileInfoQueryVariables>) {
          return Apollo.useLazyQuery<ProfileInfoQuery, ProfileInfoQueryVariables>(ProfileInfoDocument, baseOptions);
        }
export type ProfileInfoQueryHookResult = ReturnType<typeof useProfileInfoQuery>;
export type ProfileInfoLazyQueryHookResult = ReturnType<typeof useProfileInfoLazyQuery>;
export type ProfileInfoQueryResult = Apollo.QueryResult<ProfileInfoQuery, ProfileInfoQueryVariables>;
export const TagsDocument = gql`
    query Tags($tagName: String) {
  tags(where: {name_contains: $tagName}, first: 5) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...TagSnippet
    }
  }
}
    ${TagSnippetFragmentDoc}`;

/**
 * __useTagsQuery__
 *
 * To run a query within a React component, call `useTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagsQuery({
 *   variables: {
 *      tagName: // value for 'tagName'
 *   },
 * });
 */
export function useTagsQuery(baseOptions?: Apollo.QueryHookOptions<TagsQuery, TagsQueryVariables>) {
        return Apollo.useQuery<TagsQuery, TagsQueryVariables>(TagsDocument, baseOptions);
      }
export function useTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TagsQuery, TagsQueryVariables>) {
          return Apollo.useLazyQuery<TagsQuery, TagsQueryVariables>(TagsDocument, baseOptions);
        }
export type TagsQueryHookResult = ReturnType<typeof useTagsQuery>;
export type TagsLazyQueryHookResult = ReturnType<typeof useTagsLazyQuery>;
export type TagsQueryResult = Apollo.QueryResult<TagsQuery, TagsQueryVariables>;