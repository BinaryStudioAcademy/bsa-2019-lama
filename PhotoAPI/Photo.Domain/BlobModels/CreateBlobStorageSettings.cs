namespace Photo.Domain.BlobModels
{
    public class CreateBlobStorageSettings
    {
        public string ConnectionString { get; set; }
        public string ImageContainerName { get; set; }
        public string AvatarsContainerName { get; set; }
        public System.Collections.Generic.IList<string> AllowedOrigins { get; set; }
    }
}
