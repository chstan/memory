using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate.DataLoader;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

using back.Data;

namespace back.DataLoader
{
    public class UserByIdDataLoader : BatchDataLoader<int, User>
    {
        private readonly DbContextPool<AppDbContext> _dbContextPool;

        public UserByIdDataLoader(DbContextPool<AppDbContext> dbContextPool)
        {
            _dbContextPool = dbContextPool ?? throw new ArgumentNullException(nameof(dbContextPool));
        }

        protected override async Task<IReadOnlyDictionary<int, User>> LoadBatchAsync(
            IReadOnlyList<int> keys,
            CancellationToken cancellationToken)
        {
            AppDbContext dbContext = _dbContextPool.Rent();
            try
            {
                return await dbContext.Users
                    .Where(s => keys.Contains(s.Id))
                    .ToDictionaryAsync(t => t.Id, cancellationToken);
            }
            finally
            {
                _dbContextPool.Return(dbContext);
            }
        }
    }
}