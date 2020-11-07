using System;
using Microsoft.Extensions.Options;
using Storage.Net;
using Storage.Net.Blobs;

namespace back.Storages 
{
    public class BlobServiceSettings
    {
        public string ConnectionString { get; set; }
    }

    public class BlobService
    {
        private BlobServiceSettings _settings;
        public BlobService(IOptions<BlobServiceSettings> settings)
        {
            _settings = settings.Value;
        }

        public Guid GenerateBlobId()
        {
            return Guid.NewGuid();
        }

        public IBlobStorage BuildStorage()
        {
            return StorageFactory.Blobs.FromConnectionString(_settings.ConnectionString);
        }
    }
}