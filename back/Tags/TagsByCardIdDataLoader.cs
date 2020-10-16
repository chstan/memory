using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using back.Data;
using HotChocolate.DataLoader;
using System.Threading;
using System.Threading.Tasks;

namespace back.Tags
{
    public class TagsByCardIdDataLoader : GroupedDataLoader<int, Tag>
    {
        private readonly DbContextPool<AppDbContext> _dbPool;

        public TagsByCardIdDataLoader(DbContextPool<AppDbContext> dbPool)
        {
            _dbPool = dbPool ?? throw new ArgumentNullException(nameof(dbPool));
        }

        protected override async Task<ILookup<int, Tag>> LoadGroupedBatchAsync(
            IReadOnlyList<int> keys, CancellationToken cancellationToken)
        {
            AppDbContext db = _dbPool.Rent();
            try
            {
                List<CardTag> tags = await db.Cards
                    .Where(card => keys.Contains(card.Id))
                    .Include(card => card.CardTags)
                    .SelectMany(card => card.CardTags)
                    .Include(cardTag => cardTag.Tag)
                    .ToListAsync();

                return tags.Where(t => t.Tag is {}).ToLookup(t => t.CardId, t => t.Tag!);

            }
            finally 
            {
                _dbPool.Return(db);
            }
        }
    }
}