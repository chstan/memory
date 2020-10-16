using HotChocolate;
using HotChocolate.Types;

#nullable disable

namespace back.Data
{
    public class CardTag
    {
        [GraphQLIgnore]
        public int CardId { get; set; }

        [GraphQLIgnore]
        public int TagId { get; set; }

        public Card Card { get; set; }
        public Tag Tag { get; set; }
    }
}