using System;
using System.ComponentModel.DataAnnotations;
using HotChocolate;


namespace back.Data
{
    public class UserSettings
    {
        [Key]
        public int Id { get; set; }
        public User User { get; set; }


        public long MaxReviewsPerDay { get; set; }
        public float NewCardDensity { get; set; }
    }
}