import { useRouter } from "next/router";
import React from "react";
import EditCardForm from "../../forms/EditCardForm";
import { useCardDetailQuery } from "../../generated/graphql";

export const CardDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const cardId = Number.parseInt(id as string);
  const card = useCardDetailQuery({ variables: {id: cardId, }});

  if (card.loading) {
    return <></>;
  }

  const data = card.data!;

  return (
    <>
    <EditCardForm card={data.card} allowChangeKinds={false} />
    </>
  )
};

export default CardDetail;
