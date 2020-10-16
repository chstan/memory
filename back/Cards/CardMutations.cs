using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using back.Common;
using back.Data;
using back.Kata;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;
using Microsoft.AspNetCore.Authorization;

namespace back.Cards
{
    [ExtendObjectType(Name = "Mutation")]
    public class CardMutations
    {
        public async Task<CardPayloadBase> AddCardAsync(
            [GlobalState]int currentUserId,
            AddCardInput input,
            [Service] AppDbContext db)
        {
            var card = new Card
            {
                Creator = await db.Users.FindAsync(currentUserId),
                FrontText = input.FrontText,
                RearText = input.RearText,
                Kind = input.Kind,
                Engine = input.Engine,

                Interval = TimeSpan.FromMinutes(10),
                DueAt = DateTime.UtcNow,
                Ease = 2.5f,
            };

            /* Update tags: this consists of three phases
             *   1. Find existing tags to be removed (irrelevant on add)
             *   2. Create new Tags which do not exist yet, and select for the ones that do.
             *   3. Create new CardTags for the join between this card and the relevant tags
             * 
             * For now, some of this logic is duplicated also across UpdateCardAsync, and will be refactored
             * if they do not diverge sufficiently.
             */

            var addTags = Tag.BuildTags(input.NewTags);
            var existingTags = db.Tags.Where(t => input.TagIds.Contains(t.Id));
            var addCardTags = Enumerable.Concat(addTags, existingTags).Select(tag => {
                return new CardTag {
                    Card = card,
                    Tag = tag,
                };
            });

            db.Tags.AddRange(addTags);
            db.CardTags.AddRange(addCardTags);
            db.Cards.Add(card);
            await db.SaveChangesAsync();

            return new CardPayloadBase(card, input.ClientMutationId);
        }

        [Authorize(Policy = "EditsOwnCards")]
        public async Task<CardAttemptPayload> ReportAttemptAsync(
            [GlobalState]int currentUserId,
            ReportAttemptInput input,
            [Service]AppDbContext db,
            CancellationToken cancellationToken)
        {
            var card = await db.Cards.FindAsync(input.CardId);
            var cardAttempt = new CardAttempt
            {
                TimeBeforeResponding = TimeSpan.FromMilliseconds(input.TimeBeforeResponding),
                Result = input.Result,
                User = await db.Users.FindAsync(currentUserId),
                Card = card,
                ResultText = input.ResultText,
                AttemptedAt = DateTime.UtcNow,
            };
            card.MarkAttempt(cardAttempt.Result);
            db.CardAttempts.Add(cardAttempt);
            await db.SaveChangesAsync();
            return new CardAttemptPayload(cardAttempt, input.ClientMutationId);
        }

        [Authorize(Policy = "EditsOwnCards")]
        public async Task<CardAttemptPayload> AttemptKataAsync(
            AttemptKataInput input,
            [GlobalState]int currentUserId,
            [Service]AppDbContext db,
            [Service]KataService kata,
            CancellationToken cancellationToken)
        {
            var now = DateTime.UtcNow;
            var engineName = input.EvaluationEngine switch {
                EvaluationEngine.Python => "python",
                _ => throw new QueryException(
                    ErrorBuilder
                        .New()
                        .SetMessage("Invalid execution engine")
                        .SetCode("INVALID_EXECUTION_ENGINE").Build())
            };

            var req = new KataRequest
            {
                Source = input.Guess,
                ExecutionEnvironment = engineName,
                ExecutionContext = "default",
            };
            try 
            {
                var kataResult = await kata.RunKata(req);
                var user = await db.Users.FindAsync(currentUserId);
                var card = await db.Cards.FindAsync(input.CardId);

                var cardAttempt = new CardAttempt
                {
                    Result = (AttemptResult)kataResult.ResponseCode,
                    ResultText = kataResult.ResponseText,
                    TimeBeforeResponding = TimeSpan.FromSeconds(1), // TODO
                    AttemptedAt = now,
                    User = user,
                    Card = card,
                };

                card.MarkAttempt(cardAttempt.Result);
                db.CardAttempts.Add(cardAttempt);
                await db.SaveChangesAsync();
                return new CardAttemptPayload(cardAttempt, input.ClientMutationId);
            } 
            catch (KataExecutionException)
            {
                throw new QueryException(
                    ErrorBuilder
                        .New()
                        .SetMessage("Internal error, kata did not execute.")
                        .SetCode("KATA_RUNTIME").Build());
            }
        }

        [Authorize(Policy = "EditsOwnCards")]
        public async Task<PayloadBase> DeleteCardAsync(
            DeleteCardInput input,
            [Service]AppDbContext db,
            CancellationToken cancellationToken)
        {
            var card = db.Cards.Find(input.CardId);
            card.IsActive = false;
            await db.SaveChangesAsync();
            return new PayloadBase(input.ClientMutationId);
        }

        [Authorize(Policy = "EditsOwnCards")]
        public async Task<CardPayloadBase> UpdateCardAsync(
            UpdateCardInput input,
            [Service]AppDbContext db,
            CancellationToken cancellation)
        {
            var card = await db.Cards.FindAsync(input.CardId);
            
            card.FrontText = input.FrontText;
            card.RearText = input.RearText;
            card.Kind = input.Kind;
            card.Engine = input.Engine;

            /* Update tags: this consists of three phases
             *   1. Find existing tags to be removed (irrelevant on add)
             *   2. Create new Tags which do not exist yet, and select for the ones that do.
             *   3. Create new CardTags for the join between this card and the relevant tags
             * 
             * For now, some of this logic is duplicated also across AddCardAsync, and will be refactored
             * if they do not diverge sufficiently.
             */

            var addTags = Tag.BuildTags(input.NewTags);

            // now find all existing card tags
            var existingCardTags = db.CardTags.Where(t => t.CardId == card.Id);

            // partition into a delete set, and an existing keep set
            var deleteCardTags = existingCardTags.Where(t => !input.TagIds.Contains(t.TagId));
            var existingCardTagIds = existingCardTags.Select(t => t.TagId);

            // find tag ids where we do not currently have a card tag, and select tags
            var tagIdsNewlyJoined = input.TagIds.Where(id => !existingCardTagIds.Contains(id));
            var tagsNewlyJoined = db.Tags.Where(t => tagIdsNewlyJoined.Contains(t.Id));

            // construct all the card tags
            var addCardTags = Enumerable.Concat(addTags, tagsNewlyJoined).Select(tag => {
                return new CardTag {
                    Card = card,
                    Tag = tag,
                };
            });

            db.Tags.AddRange(addTags);
            db.CardTags.RemoveRange(deleteCardTags);
            db.CardTags.AddRange(addCardTags);

            await db.SaveChangesAsync();
            return new CardPayloadBase(card, input.ClientMutationId);
        }

        public class CardAttemptPayload
        {
            public CardAttemptPayload(CardAttempt cardAttempt, string? clientMutationId)
            {
                CardAttempt = cardAttempt;
                ClientMutationId = clientMutationId;
            }

            public CardAttempt CardAttempt { get; }
            public string? ClientMutationId { get; }
        }

        public class AttemptKataInput
        {
            public AttemptKataInput(EvaluationEngine evaluationEngine, string guess, int cardId, string? clientMutationId)
            {
                EvaluationEngine = evaluationEngine;
                Guess = guess;
                CardId = cardId;
                ClientMutationId = clientMutationId;
            }

            public EvaluationEngine EvaluationEngine { get; }
            public string Guess { get; }
            public int CardId { get; }
            public string? ClientMutationId { get; }
        }

        public class ReportAttemptInput
        {
            
            public AttemptResult Result { get; }
            public string ResultText { get; }
            public float TimeBeforeResponding { get; }
            public int CardId { get; }
            public string? ClientMutationId { get; }

            public ReportAttemptInput(AttemptResult result, string resultText, float timeBeforeResponding, int cardId, string? clientMutationId)
            {
                Result = result;
                ResultText = resultText;
                TimeBeforeResponding = timeBeforeResponding;
                CardId = cardId;
                ClientMutationId = clientMutationId;
            }
        }

        public class AddCardInput
        {
            public CardKind Kind { get; }
            public string FrontText { get; }
            public string RearText { get; }
            public EvaluationEngine Engine { get; }
            public string? ClientMutationId { get; }
            public List<int> TagIds { get; }
            public List<string> NewTags { get; }

            public AddCardInput(CardKind kind, string frontText, string rearText, EvaluationEngine engine, string clientMutationId, List<int> tagIds, List<string> newTags)
            {
                Kind = kind;
                FrontText = frontText;
                RearText = rearText;
                Engine = engine;
                ClientMutationId = clientMutationId;
                TagIds = tagIds;
                NewTags = newTags;
            }
        }

        public class UpdateCardInput : AddCardInput
        {
            public int CardId { get; }
            public UpdateCardInput(int cardId, CardKind kind, string frontText, string rearText, EvaluationEngine engine, string? clientMutationId, List<int> tagIds, List<string> newTags)
                : base(kind, frontText, rearText, engine, clientMutationId, tagIds, newTags)
            {
                CardId = cardId;
            }
        }
        public class DeleteCardInput
        {
            public DeleteCardInput(int cardId, string? clientMutationId)
            {
                CardId = cardId;
                ClientMutationId = clientMutationId;
            }

            public int CardId { get; }
            public string? ClientMutationId { get; }
        }
    }
}