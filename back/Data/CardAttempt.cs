using System;
using HotChocolate;
using HotChocolate.Types;

#nullable disable

namespace back.Data 
{
    public enum AttemptResult {
        Exception = 0,
        Timeout = 1,
        Failure = 2,
        Hard = 3,
        Easy = 4, 
    }

    public class AttemptResultType : EnumType<AttemptResult> {}

    public class CardAttempt
    {
        public int Id { get; set; }

        [GraphQLIgnore]
        public int CardId { get; set; }

        [GraphQLIgnore]
        public int UserId { get; set; }

        public virtual User User { get; set; }

        public virtual Card Card { get; set; }

        public AttemptResult Result { get; set; }

        [GraphQLNonNullType]
        public string ResultText { get; set; } = "";

        public TimeSpan TimeBeforeResponding { get; set; }
        public DateTime AttemptedAt { get; set; }
    }
}