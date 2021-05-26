import { CardKind } from "../generated/graphql";

export const ANKI_STYLE_COMPLETION_MATCHER = /(\{\{c::.*?\}\})/gmu;
export const ANKI_STYLE_OLD_STYLE_COMPLETION_EXTRACTION_MATCHER = /\{\{c::(.*?)(?:::(.*?))?\}\}/mu;
export const ANKI_STYLE_CLOZE_MATCHER = /(\{\{c\d+::.*?\}\})/gmu;
export const ANKI_STYLE_CLOZE_EXTRACTION_MATCHER = /\{\{c(\d+)::(.*?)(?:::(.*?))?\}\}/mu;

export const CLOZE_MATCHER = /(:::\d+([\s\S]*?):::)/gmu;
export const CLOZE_EXTRACTION_MATCHER = /:::(\d+)+([\s\S]*?):::/gmu;

export function doesTextContainClozure(text: string): Boolean {
  const matches = text.match(CLOZE_MATCHER);
  console.log(matches, text);
  return matches !== null;
}

export function inferTrueCardTypeFromText(text: string): CardKind {
  if (doesTextContainClozure(text)) {
    return CardKind.Cloze;
  }
  return CardKind.Frontandback;
}

export default {
  inferTrueCardTypeFromText,
  CLOZE_MATCHER,
  CLOZE_EXTRACTION_MATCHER,
}
