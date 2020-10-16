using System.Threading.Tasks;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace back.Authorization
{
    public class EditsOwnCardsAuthorizationHandler : AuthorizationHandler<EditsOwnCardsRequirement, IResolverContext>
    {
        AppDbContext _db;
        public EditsOwnCardsAuthorizationHandler(AppDbContext db)
        {
           _db = db; 
        }
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context, EditsOwnCardsRequirement requirement, IResolverContext resource)
        {
            if (context.User.Identity.IsAuthenticated) {
                var card = _db.Cards.Find(resource.Variables.GetVariable<int>("cardId"));
                if (card.Creator.Id == int.Parse(context.User.FindFirst("UserId").Value))
                {
                    context.Succeed(requirement);
                }
            } else {
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }

    public class EditsOwnCardsRequirement : IAuthorizationRequirement
    {}
}