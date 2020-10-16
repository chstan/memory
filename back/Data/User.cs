using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using HotChocolate;
using System;
using System.Security.Cryptography;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;
using back.Users;

#nullable disable

namespace back.Data 
{
    public class User
    {
        public int Id { get; set; }

        [GraphQLIgnore]
        public bool IsAdmin { get; set; }

        [GraphQLIgnore]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime AccountCreatedAt { get; set; }

        [GraphQLIgnore]
        public DateTime LastLoggedInAt { get; set; }

        [GraphQLIgnore]
        public bool IsAccountActive { get; set; }

        [GraphQLNonNullType]
        [Required]
        [StringLength(80)]
        public string FirstName { get; set; }

        [GraphQLNonNullType]
        [Required]
        [StringLength(80)]
        public string LastName { get; set; }

        [GraphQLNonNullType]
        [Required]
        [StringLength(256)]
        public string Email { get; set; }

        public int SettingsId { get; set; }

        [GraphQLNonNullType]
        public UserSettings Settings { get; set; }

        [GraphQLIgnore]
        public string Salt { get; set; }

        [GraphQLIgnore]
        public string PasswordHash { get; set; }

        [GraphQLIgnore]
        public List<Card> Cards {get; } 

        [GraphQLIgnore]
        public List<CardAttempt> CardAttempts { get; }


        [GraphQLIgnore]
        public bool IsPasswordCorrect(string passwordAttempt)
        {
            using var sha = SHA512.Create();

            byte[] hash = sha.ComputeHash(Encoding.UTF8.GetBytes(passwordAttempt + Salt));
            var passwordAttemptHash = Convert.ToBase64String(hash);

            return passwordAttemptHash.Equals(PasswordHash, StringComparison.Ordinal);
        }

        [GraphQLIgnore]
        public void SetPassword(string password) 
        {
            // reset the salt
            Salt = Guid.NewGuid().ToString("N");

            using var sha = SHA512.Create();
            byte[] hash = sha.ComputeHash(Encoding.UTF8.GetBytes(password + Salt));
            PasswordHash = Convert.ToBase64String(hash);
        }

        [GraphQLIgnore]
        public ClaimsIdentity GenerateClaims()
        {
            return new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, Email),
                new Claim(ClaimTypes.Email, Email),
                new Claim(WellKnownClaimTypes.UserId, Id.ToString()),
            });
        }
    }
}