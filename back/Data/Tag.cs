using System;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HotChocolate;
using HotChocolate.Types;

#nullable disable

namespace back.Data
{
    public class Tag
    {
        [Key]
        public int Id { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }

        public string Name { get; set; }

        public string Description { get; set; } = "";

        [GraphQLIgnore]

        public virtual List<CardTag> CardTags { get; set; }

        public static IEnumerable<Tag> BuildTags(List<string> names) {
            return names.Select(name => {
                return new Tag {
                    Name = name,
                    Description = "",
                };
            });
        }
    }
}