using System;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using back.Data;
using back.Types;
using HotChocolate;
using HotChocolate.Types;

namespace back.Users
{
    [ExtendObjectType(Name = "User")]
    public class UserExtension
    {
        public int GetCardsDueCount(
            [GlobalState]int currentUserId,
            [Service]AppDbContext db)
        {
            return db.Cards.Where(t => (t.CreatorId == currentUserId && t.DueAt < DateTime.UtcNow)).Count();
        }

        public int GetKatasDueCount(
            [GlobalState]int currentUserId,
            [Service]AppDbContext db)
        {
            return db.Cards.Where(t => (
                t.CreatorId == currentUserId && 
                t.DueAt < DateTime.UtcNow && 
                t.Kind == CardKind.Kata)).Count();
        }

        public ReviewHistory GetReviewHistory(
            [Parent]User user,
            [Service]AppDbContext db)
        {
            return new ReviewHistory(db, user.Id);
        }

        // [UsePaging]
        // [UseFiltering]
        // [UseSorting]
        // public IQueryable<Card> GetCardsDue (
        //     [GlobalState]int currentPersonId,
        //     [Service]AppDbContext dbContext)
        // {
        //     return dbContext.Cards.Where(t =>
        //         (t.CreatorId == currentPersonId && t.DueAt < DateTime.UtcNow));
        // }
    }
}