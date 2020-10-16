using System;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using back.Data;
using System.Text.RegularExpressions;

namespace back.Import
{
    public class ImportServiceSettings
    {
        public int MaxUploadBytes { get; set; }
    }

    public class ImportServiceResult
    {
        public Boolean Imported { get; set; }
        public IEnumerable<Card> Cards { get; set; } = new List<Card>();
        public HashSet<(int, string)> RawCardTags { get; set; } = new HashSet<(int, string)>();
        public HashSet<string> RawTags { get; set; } = new HashSet<string>();
    }

    public class AnkiTextImportService
    {
        public static Boolean IsAnkiCloze(string frontText)
        {
            var clozeRx = new Regex(@"{{c(\d+)::(.*?)(?:::(.*?))?}}");
            return clozeRx.Match(frontText).Success;
        }
        public static string NormalizeAnkiLatex(string frontText)
        {
            var standardMathRx = new Regex(@"\[\/?\$\]");
            var displayMathRx = new Regex(@"\[\/?\$\$\]");
            var cleaned = displayMathRx.Replace(
                standardMathRx.Replace(frontText, "$"),
                "$$"
            );
            return cleaned;
        }

        public static async Task<ImportServiceResult> ImportFromTextFile(Stream stream)
        {
            var cards = new List<Card>(100);
            var rawTags = new HashSet<string>(100);
            var cardTags = new HashSet<(int, string)>(100);

            using (StreamReader sr = new StreamReader(stream))
            {
                int lastCount = 0;
                while (sr.Peek() >= 0)
                {
                    var nextLine = await sr.ReadLineAsync();
                    if (nextLine != null) 
                    {
                        var tokens = nextLine.Split("\t");
                        var frontText = NormalizeAnkiLatex(tokens[0]);
                        var rearText = NormalizeAnkiLatex(tokens[1]);

                        var kind = IsAnkiCloze(frontText) ? CardKind.Cloze : CardKind.FrontAndBack;

                        var newCards = kind switch 
                        {
                            CardKind.FrontAndBack => Enumerable.Repeat(Card.BuildFrontAndBackCard(null, frontText, rearText), 1),
                            CardKind.Cloze => Card.BuildClozeCards(null, frontText),
                            _ => throw new Exception("Invalid kind."),
                        };

                        var tagTokens = tokens[2].Trim().Split().Select(x => x.Trim()).Where(x => x.Length > 0);
                        rawTags.UnionWith(tagTokens);

                        cards.AddRange(newCards);

                        // make our virtual join table of cards to tags
                        int currentCount = cards.Count();

                        for (int i = lastCount; i < currentCount; i++) 
                        {
                            var joins = tagTokens.Select(x => (i, x)).ToHashSet();
                            cardTags.UnionWith(joins);
                        }

                        lastCount = currentCount;
                    }
                }
            }

            return new ImportServiceResult
            {
                Cards = cards,
                RawTags = rawTags,
                RawCardTags = cardTags,
                Imported = true,
            };
        }
    }
}