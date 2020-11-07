using System;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Storage.Net;
using Storage.Net.Blobs;

namespace back.Storages
{
    public class UploadFileController : ControllerBase
    {
        [NonAction]
        public async static Task<FileUploadResult> UploadSingleFileAsBlob(BlobService blobService, IFormFile file)
        {
            var storage = blobService.BuildStorage();
            var guid = blobService.GenerateBlobId();


            var blobMeta = new BlobInfo
            {
                FileName = file.FileName,
                ContentType = file.ContentType,
            };
            var blobMetaJSON = JsonSerializer.Serialize(blobMeta);
            var bytes = Encoding.UTF8.GetBytes(blobMetaJSON);
            var encodedJSON = Convert.ToBase64String(bytes);
            var fullId = $"{guid}&{encodedJSON}".ToString();

            using (var ms = new MemoryStream()) {
                await file.CopyToAsync(ms);
                await storage.WriteAsync(fullId, ms.ToArray());
            }

            var idList = new List<string>();
            idList.Add(fullId);
            return new FileUploadResult(true, idList);
        }

        [HttpGet]
        [Route("api/upload_file/{id}")]
        public async Task<ActionResult> OnDownloadFileAsync(
            string id,
            [FromServices]BlobService blobService) 
        {
            var s = new MemoryStream();
            var storage = blobService.BuildStorage();

            var encodedJson = id.Split("&")[1];
            var bytes = Convert.FromBase64String(encodedJson);
            var json = Encoding.UTF8.GetString(bytes);
            BlobInfo blobInfo = JsonSerializer.Deserialize<BlobInfo>(json);

            using (Stream ss = await storage.OpenReadAsync(id))
            {
                await ss.CopyToAsync(s);
                var contentDisposition = new System.Net.Mime.ContentDisposition
                {
                    FileName = blobInfo.FileName,
                    Inline = true,
                };
                HttpContext.Response.Headers.Add("Content-Disposition", contentDisposition.ToString());
                return File(s.ToArray(), blobInfo.ContentType);
            }
        }

        [HttpPost]
        [Route("api/upload_file")]
        public async Task<ActionResult<FileUploadResult>> OnUploadFileAsync(
            IList<IFormFile> files,
            [FromServices]BlobService blobService)
        {
            var uploads = files.Select(file => UploadFileController.UploadSingleFileAsBlob(blobService, file));
            var uploadResults = await Task.WhenAll(uploads);

            return new FileUploadResult(true, uploadResults.SelectMany(x => x.BlobNames).ToList());
        }
    }

    public class BlobInfo
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
    }
    public class FileUploadResult
    {
        public Boolean DidSucceed { get; set; }
        public List<string> BlobNames { get; set; }

        public FileUploadResult(bool didSucceed, List<string> blobNames)
        {
            DidSucceed = didSucceed;
            BlobNames = blobNames;
        }
    }
}