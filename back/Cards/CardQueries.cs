using System;
using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using HotChocolate.Types.Relay;

using back.Data;
using HotChocolate.AspNetCore.Authorization;

namespace back.Cards
{
    [ExtendObjectType(Name = "Query")]
    public class CardQueries
    {
        [Authorize(Policy = "AuthenticatedUser")]
        [UsePaging]
        [UseSelection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Card> GetCardsDue(
            [GlobalState]int currentUserId,
            [Service]AppDbContext db)
        {
            return db.Cards
                .Where(t => t.Creator.Id == currentUserId)
                .Where(t => t.DueAt < DateTime.UtcNow);
        }

        [Authorize(Policy = "AuthenticatedUser")]
        [UseFirstOrDefault]
        [UseSelection]
        public IQueryable<Card> GetCard(
            [GlobalState]int currentUserId,
            GetCardInput input,
            [Service] AppDbContext db)
        {
            var user = db.Users.Find(currentUserId);

            var cards = db.Cards.Where(t => (t.Id == input.CardId));
            if (user.IsAdmin)
            {
                return cards;
            }
            else {
                return cards.Where(t => t.Creator.Id == currentUserId);
            }
        }

        public class GetCardInput
        {
            public int CardId { get; }

            public GetCardInput(int cardId)
            {
                CardId = cardId;
            }
        }
    }
}