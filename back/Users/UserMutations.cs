using System;

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;

using back.Data;

namespace back.Users
{
    [ExtendObjectType(Name = "Mutation")]
    public class UserMutations
    {
        public async Task<AddUserPayload> AddUserAsync(
            AddUserInput input,
            [Service] AppDbContext db,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(input.Name))
            {
                throw new QueryException(
                    ErrorBuilder
                        .New()
                        .SetMessage("The name cannot be empty.")
                        .SetCode("USERNAME_EMPTY").Build());
            }

            if (string.IsNullOrEmpty(input.Email))
            {
                throw new QueryException(
                    ErrorBuilder
                        .New()
                        .SetMessage("The name cannot be empty.")
                        .SetCode("USERNAME_EMPTY").Build());
            }
            if (string.IsNullOrEmpty(input.Password))
            {
                throw new QueryException(
                    ErrorBuilder
                        .New()
                        .SetMessage("The password cannot be empty.")
                        .SetCode("PASSWORD_EMPTY").Build());
            }

            var user = new User
            {
                Email = input.Email,
                Settings = new UserSettings
                {
                    MaxReviewsPerDay = 100,
                    NewCardDensity = 0.5f,
                }
            };
            user.SetPassword(input.Password);

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return new AddUserPayload(user, input.ClientMutationId);
        }

        public async Task<bool> LogoutAsync(
            [GlobalState]int currentUserId,
            [Service] AppDbContext db,
            [Service] CancellationToken cancellationToken)
        {
            // TODO, actually revoke the token
            // in order to do this we need to set up in memory cacheing
            // and then add the token to it here
            return true;
        }

        public async Task<LoginPayload> LoginAsync(
            LoginInput input,
            [Service] AppDbContext db,
            [Service] CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(input.Email))
            {
                throw new QueryException(
                    ErrorBuilder
                        .New()
                        .SetMessage("The email can't be empty.")
                        .SetCode("EMAIL_EMPTY")
                        .Build());
            }
            if (string.IsNullOrEmpty(input.Password))
            {
                throw new QueryException(
                    ErrorBuilder
                        .New()
                        .SetMessage("The password can't be empty.")
                        .SetCode("PASSWORD_EMPTY")
                        .Build());
            }

            User? user = await db.Users.FirstOrDefaultAsync(t => t.Email == input.Email);

            if (user is null)
            {
                throw new QueryException(
                    ErrorBuilder
                        .New()
                        .SetMessage("The specified username or email are invalid.")
                        .SetCode("INVALID_CREDENTIALS")
                        .Build());
            }

            if (!user.IsPasswordCorrect(input.Password))
            {
                throw new QueryException(
                    ErrorBuilder
                        .New()
                        .SetMessage("The specified username or email are invalid.")
                        .SetCode("INVALID_CREDENTIALS")
                        .Build());
            }

            var identity = user.GenerateClaims();
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.UtcNow.AddHours(12),
                IssuedAt = DateTime.UtcNow,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Startup.SharedSecret),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            string tokenString = tokenHandler.WriteToken(token);
            return new LoginPayload(user, tokenString, "bearer", input.ClientMutationId);
        }
    }
}