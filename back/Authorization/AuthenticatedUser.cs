using System;
using System.Threading.Tasks;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace back.Authorization
{
    public class AuthenticatedUserAuthorizationHandler : AuthorizationHandler<AuthenticatedUserRequirement, IResolverContext>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context, AuthenticatedUserRequirement requirement, IResolverContext resource)
        {
            if (context.User.Identity.IsAuthenticated) {
                context.Succeed(requirement);
            } else {
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }

    public class AuthenticatedUserRequirement : IAuthorizationRequirement
    {}
}