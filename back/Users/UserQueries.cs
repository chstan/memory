using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using back.Data;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;

namespace back.Users
{
    [ExtendObjectType(Name = "Query")]
    public class UserQueries
    {

        [Authorize(Policy = "AuthenticatedUser")]
        [UseFirstOrDefault]
        [UseSelection]
        public IQueryable<User> GetMe(
            [GlobalState]int currentUserId,
            [Service]AppDbContext db)
            {
                return db.Users.Where(t => t.Id == currentUserId);
            }
    }
}