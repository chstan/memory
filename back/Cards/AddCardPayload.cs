using System.Collections.Generic;
using back.Data;
using back.Common;

namespace back.Cards
{
    public class AddCardPayload : CardPayloadBase
    {
        public AddCardPayload(Card card, string? clientMutationId)
            : base(card, clientMutationId)
        {}

        public AddCardPayload(IReadOnlyList<UserError> errors, string? clientMutationId)
            : base(errors, clientMutationId)
        {}
    }
}