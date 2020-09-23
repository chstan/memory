using System;
using System.ComponentModel.DataAnnotations;
using HotChocolate;

namespace back.Data 
{
    public enum CardKind {
        Cloze = 1,
        Completion = 2,
        Kata = 3,
    }

    public enum EvaluationEngine {
        Python = 1,
        LocalJavascript = 2,
    }

    public class Card
    {
        [Key]
        public int Id { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime UpdatedOn { get; set; }

        [Required]
        [GraphQLNonNullType]
        public User Creator  { get; set; }

        [GraphQLNonNullType]
        public CardKind Kind { get; set; }

        public string FrontText { get; set; }
        public string RearText { get; set; }
        public string EvalExpectations { get; set; }
        public EvaluationEngine Engine { get; set; }

        public DateTime DueAt { get; set; }
        public float Difficulty { get; set; }
    }
}