using System;
using System.ComponentModel.DataAnnotations;

namespace back.Data 
{
    public enum AttemptResult {
        Failed = 1,
        Hard = 2,
        Easy = 3,
        
        TimeOut = 4,
        SyntaxError = 5,
    }

    public class CardAttempt
    {
        public User User { get; set; }
        public Card Card { get; set; }
        public AttemptResult Result { get; set; }
        public TimeSpan AnswerInterval { get; set; }
    }
}