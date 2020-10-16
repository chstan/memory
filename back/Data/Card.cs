using System;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HotChocolate;
using HotChocolate.Types;
using System.Text.RegularExpressions;

#nullable disable

namespace back.Data 
{    
    public enum CardKind {
        Cloze = 1,
        FrontAndBack = 2,
        Completion = 3,
        Kata = 4,
    }
    public class CardKindType : EnumType<CardKind> {}

    public enum EvaluationEngine {
        Python = 1,
        LocalJavascript = 2,
    }

    public class EvaluationEngineType : EnumType<EvaluationEngine> {}

    public class Card
    {
        [Key]
        public int Id { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime UpdatedAt { get; set; }

        public bool? IsActive { get; set; }

        [GraphQLIgnore]
        public int CreatorId { get; set; }
        public User Creator  { get; set; }

        [GraphQLNonNullType]
        public CardKind Kind { get; set; }

        [GraphQLNonNullType]
        public string FrontText { get; set; } = "";

        [GraphQLNonNullType]
        public string RearText { get; set; } = "";

        [GraphQLNonNullType]
        public EvaluationEngine Engine { get; set; }

        public DateTime DueAt { get; set; }
        public TimeSpan Interval { get; set; }
        public float Ease { get; set; }
        public int ClozeItem { get; set; }

        public List<CardAttempt> CardAttempts { get; set; } = new List<CardAttempt>();

        [GraphQLIgnore]
        public List<CardTag> CardTags { get; } = new List<CardTag>();

        [GraphQLIgnore]
        public void MarkAttempt(AttemptResult result)
        {
            if (result == AttemptResult.Exception || result == AttemptResult.Timeout)
            {
                result = AttemptResult.Failure;
            }

            var easeAdjustment = result switch {
                AttemptResult.Failure => -0.4f,
                AttemptResult.Hard => -0.1f,
                AttemptResult.Easy => 0.1f,
                _ => 0.0f,
            };

            // Adjust the ease down, but not below the minimum value of 1.3
            Ease = Math.Max(1.3f, Ease - easeAdjustment);

            // Adjust the interval
            // TODO: incorporate relearning or implement another algorithm
            var oldInterval = Interval;
            Interval = result switch {
                AttemptResult.Failure => TimeSpan.FromMinutes(10),
                AttemptResult.Hard    => oldInterval * 1.2,
                _ => (oldInterval > TimeSpan.FromHours(1.0f)) switch {
                   true => TimeSpan.FromDays(1.0f),
                   false => oldInterval * Ease,
                }
            };

            // Now we need to set the due date for the card
            DueAt = DueAt + Interval;
        }

        public static Card BuildFrontAndBackCard(User creator, string frontText, string rearText)
        {
            return new Card {
                Creator = creator,
                FrontText = frontText,
                RearText = rearText,
                Interval = TimeSpan.FromMinutes(10),
                DueAt = DateTime.UtcNow,
                Ease = 2.5f,
                Kind = CardKind.FrontAndBack,
                Engine = EvaluationEngine.LocalJavascript,
            };
        }

        public static Card BuildCompletionCard(User creator, string frontText)
        {
            return new Card {
                Creator = creator,
                FrontText = frontText,
                RearText = "",
                Interval = TimeSpan.FromMinutes(10),
                DueAt = DateTime.UtcNow,
                Ease = 2.5f,
                Kind = CardKind.Completion,
                Engine = EvaluationEngine.LocalJavascript,
            };
        }

        public static IEnumerable<Card> BuildClozeCards(User creator, string frontText)
        {
            Regex clozeRx = new Regex(@"{{c(\d+)::(.*?)(?:::(.*?))?}}");
            var matches = clozeRx.Matches(frontText);
            var clozeIds = matches.Select(match => int.Parse(match.Groups[1].Value));

            return clozeIds.Select(clozeItem => {
                return new Card {
                    Creator = creator,
                    FrontText = frontText,
                    RearText = "",
                    Interval = TimeSpan.FromMinutes(10),
                    DueAt = DateTime.UtcNow,
                    Ease = 2.5f,
                    Kind = CardKind.Cloze,
                    ClozeItem = clozeItem,
                    Engine = EvaluationEngine.LocalJavascript
                };
            });
        }

        public static Card BuildKataCard(User creator, string frontText, EvaluationEngine engine)
        {
            return new Card
            {
                Creator = creator,
                FrontText = frontText,
                RearText = "",
                Interval = TimeSpan.FromMinutes(10),
                DueAt = DateTime.UtcNow,
                Ease = 2.5f,
                Kind = CardKind.Kata,
                Engine = engine,
            };
        }
    }
}