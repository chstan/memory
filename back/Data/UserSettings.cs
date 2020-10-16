using System;
using System.ComponentModel.DataAnnotations;
using HotChocolate;

#nullable disable

namespace back.Data
{
    public class UserSettings
    {
        public int Id { get; set; }
        public User User { get; set; }


        public long MaxReviewsPerDay { get; set; }
        public float NewCardDensity { get; set; }
    }
}