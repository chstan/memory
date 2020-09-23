using System.Threading.Tasks;
using back.Data;
using back.Extensions;
using HotChocolate;
using HotChocolate.Types;

namespace back.Cards
{
    [ExtendObjectType(Name = "Mutation")]
    public class CardMutations
    {
        [UseApplicationDbContext]
        public async Task<AddCardPayload> AddCardAsync(
            AddCardInput input,
            [ScopedService] AppDbContext context)
        {
            var card = new Card
            {};

            context.Cards.Add(card);
            await context.SaveChangesAsync();

            return new AddCardPayload(card, input.ClientMutationId);
        }
    }
}