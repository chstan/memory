using System;
using System.Collections.Generic;

namespace back.Common
{
    public class PayloadEmpty
    {
        public PayloadEmpty() {}
    }

    public class PayloadBase
    {
        public PayloadBase(string? clientMutationId)
        {
            Errors = Array.Empty<UserError>(); ;
            ClientMutationId = clientMutationId;
        }

        public PayloadBase(IReadOnlyList<UserError> errors, string? clientMutationId)
        {
            Errors = errors;
            ClientMutationId = clientMutationId;
        }

        public IReadOnlyList<UserError> Errors { get; }

        public string? ClientMutationId { get; }
    }
}
