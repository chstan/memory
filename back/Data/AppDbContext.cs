using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using back.Data;
using System.Linq;
using back.Import;
using System.Threading.Tasks;
using System;

namespace back 
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base (options)
        {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<User>()
                .HasIndex(a => a.Email)
                .IsUnique();
            
            modelBuilder
                .Entity<User>()
                .HasOne(a => a.Settings)
                .WithOne(a => a.User)
                .HasForeignKey<User>(c => c.SettingsId);

            modelBuilder
                .Entity<CardTag>()
                .HasKey(ct => new { ct.CardId, ct.TagId });

            modelBuilder
                .Entity<CardTag>()
                .HasOne(t => t.Card)
                .WithMany(t => t.CardTags)
                .HasForeignKey(t => t.CardId);

            modelBuilder
                .Entity<CardTag>()
                .HasOne(t => t.Tag)
                .WithMany(t => t.CardTags)
                .HasForeignKey(t => t.TagId);

            modelBuilder
                .Entity<Tag>()
                .Property(s => s.CreatedAt)
                .HasDefaultValueSql("date('now')");

            modelBuilder
                .Entity<Tag>()
                .HasIndex(t => t.Name)
                .IsUnique();
                
            modelBuilder
                .Entity<Card>()
                .HasOne(t => t.Creator)
                .WithMany(t => t.Cards)
                .HasForeignKey(t => t.CreatorId);

            modelBuilder
                .Entity<CardAttempt>()
                .HasOne(t => t.User)
                .WithMany(t => t.CardAttempts)
                .HasForeignKey(t => t.UserId);

            modelBuilder
                .Entity<CardAttempt>()
                .HasOne(t => t.Card)
                .WithMany(t => t.CardAttempts)
                .HasForeignKey(t => t.CardId);

            modelBuilder
                .Entity<Card>()
                .Property(b => b.IsActive)
                .HasDefaultValue(true);

            modelBuilder
                .Entity<User>()
                .Property(s => s.AccountCreatedAt)
                .HasDefaultValueSql("date('now')");

            modelBuilder
                .Entity<Card>()
                .Property(s => s.CreatedAt)
                .HasDefaultValueSql("date('now')");

            modelBuilder
                .Entity<Card>()
                .Property(s => s.UpdatedAt)
                .HasDefaultValueSql("date('now')");

            modelBuilder
                .Entity<User>()
                .Property(s => s.IsAccountActive)
                .HasDefaultValueSql("true");

            modelBuilder.Entity<UserSettings>().HasData(
                new UserSettings
                {
                    Id = 1,
                    NewCardDensity = 0.5f,
                    MaxReviewsPerDay = 200,
                },
                new UserSettings
                {
                    Id = 2,
                    NewCardDensity = 0.5f,
                    MaxReviewsPerDay = 200,
                }
            );

            var adminUser = new User
            {
                Id = 1,
                SettingsId = 1,
                FirstName = "Admin",
                LastName = "Admin",
                Email = "admin",
            };
            adminUser.SetPassword("admin");
            var regularUser = new User
            {
                Id = 2,
                SettingsId = 2,
                FirstName = "Average",
                LastName = "Joe",
                Email = "regular-user",
            };
            regularUser.SetPassword("regular-user");
            modelBuilder.Entity<User>().HasData(adminUser, regularUser);

            var clozeCards = Card.BuildClozeCards(adminUser, "This is a {{c1::cloze card}} with two {{c2::clozes}}.").ToList();
            var kataCard = Card.BuildKataCard(adminUser, "# Python\n\n", EvaluationEngine.Python);
            var kataCard2 = Card.BuildKataCard(adminUser, "//JavaScript\n\n", EvaluationEngine.LocalJavascript);
            var completionCard = Card.BuildCompletionCard(adminUser, "This is a [completion card] {{c::completion card}}.");

            kataCard.Id = 2;
            kataCard2.Id = 3;
            completionCard.Id = 4;
            clozeCards[0].Id = 5;
            clozeCards[1].Id = 6;
            int currentId = 7;

            kataCard.CreatorId = kataCard.Creator.Id;
            kataCard.Creator = null;
            kataCard2.CreatorId = kataCard2.Creator.Id;
            kataCard2.Creator = null;
            completionCard.CreatorId = completionCard.Creator.Id;
            completionCard.Creator = null;
            clozeCards[0].CreatorId = clozeCards[0].Creator.Id;
            clozeCards[0].Creator = null;
            clozeCards[1].CreatorId = clozeCards[1].Creator.Id;
            clozeCards[1].Creator = null;

            modelBuilder.Entity<Card>().HasData(
                kataCard, kataCard2, completionCard, clozeCards[0], clozeCards[1]);
            
            Console.WriteLine("Loading cards from imported file");
            var task = Task.Run(async () => await ImportFromFileController.ImportFromLocalFileAsync(@"e:\home\src\memory\fixtures\decks.txt")); 
            var result = task.GetAwaiter().GetResult();

            foreach (var card in result.Cards) 
            {
                card.CreatorId = 1;
                card.Id = currentId;
                currentId += 1;
            }
            var cardsArr = result.Cards.ToArray();
            modelBuilder.Entity<Card>().HasData(cardsArr);

            var assembledTags = new Dictionary<string, Tag>(result.RawTags.Count());
            var assembledCardTags = new Dictionary<(int, int), CardTag>(result.RawCardTags.Count());
            int tagIdx = 1;
            foreach (string rawTag in result.RawTags) 
            {
                var tag = new Tag
                {
                    Id = tagIdx,
                    Name = rawTag,
                    Description = "",
                };
                assembledTags.Add(rawTag, tag);
                tagIdx += 1;
            }

            foreach (var (cardIdx, tagText) in result.RawCardTags)
            {
                var tagId = assembledTags[tagText].Id;
                var cardId = cardsArr[cardIdx].Id;
                var cardTag = new CardTag
                {
                    CardId = cardId,
                    TagId = tagId,
                };
                assembledCardTags.Add((cardId, tagId), cardTag);
            }

            modelBuilder.Entity<Tag>().HasData(assembledTags.Values);
            modelBuilder.Entity<CardTag>().HasData(assembledCardTags.Values);
            Console.WriteLine("Loaded...");
        }

        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Tag> Tags { get; set; } = default!;
        public DbSet<Card> Cards { get; set; } = default!;
        public DbSet<CardTag> CardTags { get; set; } = default!;
        public DbSet<CardAttempt> CardAttempts { get; set; } = default!;
        public DbSet<UserSettings> UserSettings { get; set; } = default!;
    } 
}