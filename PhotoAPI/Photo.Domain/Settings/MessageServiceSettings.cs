using Services.Interfaces;

namespace Photo.Domain.Settings
{
    // use this to initialize message service
    public class MessageServiceSettings
    {
        public IProducer PhotoProcessorProducer { get; set; }
        public IConsumer PhotoProcessorConsumer { get; set; }
    }
}
