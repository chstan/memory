//https://github.com/ChilliCream/hotchocolate-examples/blob/master/workshop/src/Server/PureCodeFirst%2BEF/Users/UserMutations.cs
using System;
using System.Text;

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using HotChocolate.Types;

using back.Data;

namespace back.Users
{
    [ExtendObjectType(Name = "Mutation")]
    public class UserMutations
    {
        public async Task<CreateUserPayload> CreateUser(
            CreateUserInput input,
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

            string salt = Guid.NewGuid().ToString("N");

            using var sha = SHA512.Create();
            byte[] hash = sha.ComputeHash(Encoding.UTF8.GetBytes(input.Password + salt));

            var user = new User
            {
                Email = input.Email,
                PasswordHash = Convert.ToBase64String(hash),
                Salt = salt,
                Settings = new UserSettings
                {
                    MaxReviewsPerDay = 100,
                    NewCardDensity = 0.5f,
                }
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return new CreateUserPayload(user, input.ClientMutationId);
        }

        public async Task<LoginPayload> LoginAsync(
            LoginInput input,
            [Service] AppDbContext db,
            [Service] ITopicEventSender eventSender,
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

            using var sha = SHA512.Create();
            byte[] hash = sha.ComputeHash(Encoding.UTF8.GetBytes(input.Password + user.Salt));

            if (!Convert.ToBase64String(hash).Equals(user.PasswordHash, StringComparison.Ordinal))
            {
                throw new QueryException(
                    ErrorBuilder
                        .New()
                        .SetMessage("The specified username or email are invalid.")
                        .SetCode("INVALID_CREDENTIALS")
                        .Build());
            }

            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(WellKnownClaimTypes.UserId, user.Id.ToString()),
            });

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.UtcNow.AddHours(12),
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