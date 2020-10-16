using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using back.Data;
using HotChocolate.DataLoader;
using Microsoft.EntityFrameworkCore;

namespace back.Users
{
    public class UserByIdDataLoader : BatchDataLoader<int, User>
    {
        private readonly AppDbContext _db;

        public UserByIdDataLoader(AppDbContext db)
        {
            _db = db;
        }

        protected override async Task<IReadOnlyDictionary<int, User>> LoadBatchAsync(IReadOnlyList<int> keys, CancellationToken cancellationToken)
        {
            Console.WriteLine("keys: {0}", String.Join(", ", keys));
            return await _db.Users.Where(t => keys.Contains(t.Id))
                .ToDictionaryAsync(t => t.Id);
        }
    }
}