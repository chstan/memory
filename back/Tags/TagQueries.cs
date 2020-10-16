using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using HotChocolate.Types.Relay;

using back.Data;
using HotChocolate.AspNetCore.Authorization;

namespace back.Tags
{
    [ExtendObjectType(Name = "Query")]
    public class TagQueries
    {
        [Authorize(Policy = "AuthenticatedUser")]
        [UsePaging]
        [UseSelection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Tag> GetTags([Service]AppDbContext db)
        {
            return db.Tags;
        }
    }
}