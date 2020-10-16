using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace back.Import
{
    [ApiController]
    [Route("api/import")]
    [Produces("application/json")]
    public class ImportFromFileController : ControllerBase
    {
        private ImportServiceSettings _settings;
        public ImportFromFileController(IOptions<ImportServiceSettings> settings)
        {
            _settings = settings.Value;
        }

        [NonAction]
        public async static Task<ImportServiceResult> ImportFromLocalFileAsync(string pathToFile)
        {
            if (Path.HasExtension(pathToFile)) 
            {
                using (FileStream fs = System.IO.File.OpenRead(pathToFile))
                {
                    var results = await AnkiTextImportService.ImportFromTextFile(fs);
                    return results;
                }
            } 
            else 
            {
                throw new Exception($"Cannot import from: {pathToFile}, file does not exist.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ImportServiceResult>> OnUploadFileAsync(
            IList<IFormFile> files)
        {
            using (var memoryStream = new MemoryStream())
            {
                var firstFile = files[0];
                await firstFile.CopyToAsync(memoryStream);

                if (memoryStream.Length < _settings.MaxUploadBytes)
                {
                    var importDetails = await AnkiTextImportService.ImportFromTextFile(memoryStream);
                    return importDetails;
                }
                else
                {
                    throw new Exception("File too large.");
                }
            }
        }
    }
}