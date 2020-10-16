using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using back.Data;
using back.Common;

namespace back.UsersSettings
{
    [ExtendObjectType(Name = "Mutation")]
    public class UserSettingsMutations
    {
        [Authorize(Policy = "AuthenticatedUser")]
        public async Task<UserSettingsPayload> UpdateReviewSettingsAsync(
            [GlobalState] int currentUserId,
            [Service] AppDbContext db,
            UpdateReviewSettingsInput input,
            CancellationToken cancellationToken)
        {
            var user = await db.Users.FindAsync(currentUserId);
            var settings = await db.UserSettings.FindAsync(user.SettingsId);
            settings.MaxReviewsPerDay = input.MaxReviewsPerDay;
            settings.NewCardDensity = input.NewCardDensity;
            await db.SaveChangesAsync();
            return new UserSettingsPayload(settings, input.ClientMutationId);
        }
    }

    public class UserSettingsPayload
    {
        public UserSettings Settings { get; }
        public string? ClientMutationId { get; }

        public UserSettingsPayload(UserSettings settings, string clientMutationId)
        {
            Settings = settings;
            ClientMutationId = clientMutationId;
        }
    }
    public class UpdateReviewSettingsInput
    {
        public int MaxReviewsPerDay { get; }
        public float NewCardDensity { get; }
        public string? ClientMutationId { get; }

        public UpdateReviewSettingsInput(int maxReviewsPerDay, float newCardDensity, string? clientMutationId)
        {
            MaxReviewsPerDay = maxReviewsPerDay;
            NewCardDensity = newCardDensity;
            ClientMutationId = clientMutationId;
        }
    }
}