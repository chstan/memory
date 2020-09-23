using System.Collections.Generic;
using back.Common;
using back.Data;

namespace back.Cards
{
    public class CardPayloadBase : PayloadBase
    {
        public CardPayloadBase(Card card, string? clientMutationId)
            : base(clientMutationId)
        {
            Card = card;
        }

        public CardPayloadBase(IReadOnlyList<UserError> errors, string? clientMutationId)
            : base(errors, clientMutationId)
        {}

        public Card? Card { get; }
    }
}