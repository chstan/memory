using System;
using System.Collections.Generic;
using System.Linq;
using back.Data;
using HotChocolate;

namespace back.Types
{
    public class ReviewStatistic {
        public float CorrectFraction { get; set; }
        public int ReviewCount { get; set; }
    }
    public class ReviewHistory
    {
        private readonly AppDbContext _db;
        private readonly int _userId;
        public ReviewHistory(AppDbContext db, int userId)
        {
            _db = db;
            _userId = userId;
        }

        public ReviewStatistic GetToday() => GetSince(DateTime.UtcNow - TimeSpan.FromDays(1));
        public ReviewStatistic GetLastWeek() => GetSince(DateTime.UtcNow - TimeSpan.FromDays(7));
        public ReviewStatistic GetLastMonth() => GetSince(DateTime.UtcNow - TimeSpan.FromDays(30));
        public ReviewStatistic GetLastYear() => GetSince(DateTime.UtcNow - TimeSpan.FromDays(365));

        [GraphQLIgnore]
        public ReviewStatistic GetSince(DateTime since)
        {
            var attempts = _db.CardAttempts.Where(t => (
                (t.UserId == _userId) && (t.AttemptedAt >= since)));

            var acceptableResults = new List<AttemptResult> { AttemptResult.Hard, AttemptResult.Easy };
            var reviewCount = attempts.Count();
            var correctCount = attempts.Where(t => acceptableResults.Contains(t.Result)).Count();
            return new ReviewStatistic
            {
                CorrectFraction = (1.0f * correctCount) / reviewCount,
                ReviewCount = reviewCount,
            };
        }
    }
}