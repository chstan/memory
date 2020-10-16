using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using back.Data;
using back.Tags;
using HotChocolate;
using HotChocolate.Types;

namespace back.Cards
{
    [ExtendObjectType(Name = "Card")]
    public class CardExtension
    {

        public async Task<IEnumerable<Tag>> GetTagsAsync(
            [Parent]Card card,
            TagsByCardIdDataLoader tagsByCardId,
            CancellationToken cancellationToken)
        {
            return await tagsByCardId.LoadAsync(card.Id, cancellationToken);
        }
    }
}