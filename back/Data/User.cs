using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using HotChocolate;

namespace back.Data 
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(80)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(80)]
        public string LastName { get; set; }

        [Required]
        [StringLength(256)]
        public string Email { get; set; }

        public UserSettings Settings { get; set; }

        [GraphQLIgnore]
        public string Salt { get; set; }

        [GraphQLIgnore]
        public string PasswordHash { get; set; }

        [GraphQLIgnore]
        public List<Card> Cards {get; } = new List<Card>();
    }
}