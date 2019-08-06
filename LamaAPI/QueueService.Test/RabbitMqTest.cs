using QueueService.Implementation.RabbitMq;
using QueueService.Interfaces;
using QueueService.Models;

using RabbitMQ.Client;

using Xunit;

namespace QueueService.Test
{
    public class RabbitMqTest
    {
        [Fact]
        public void RecieveDataWithMethod_WhenSendOneMessage_Then_RecieveMessage()            
        {
            // Arrange
            IConnectionFactory connectionFactory = new DefaultConnectionFactory();

            IConnectionProvider factory = new ConnectionProvider(connectionFactory);

            Settings settings = new Settings()
            {
                ExchangeName = "TestExchanger",
                ExchangeType = ExchangeType.Direct,
                QueueName = "TestQueue",
                RoutingKey = "test"
            };

            IProducer producer = factory.Open(settings);

            IConsumer consumer = factory.Connect(settings);

            string expectedString = "Hello world";

            // Act
            producer.Send(expectedString);

            ReceiveData recievedData = consumer.Receive(100);
            string actualString = recievedData.Message;

            // Assert
            Assert.Equal(expectedString, actualString);

            consumer.SetAcknowledge(recievedData.DeliveryTag, true);
            consumer.Dispose();
            producer.Dispose();            
        }
        
        [Fact]
        public void RecieveDataWithRecievedEvent_WhenCorrectData_Then_RecieveMessage()
        {
            // Arrange
            IConnectionFactory connectionFactory = new DefaultConnectionFactory();

            IConnectionProvider factory = new ConnectionProvider(connectionFactory);

            Settings settings = new Settings()
            {
                ExchangeName = "TestExchanger2",
                ExchangeType = ExchangeType.Topic,
                QueueName = "TestQueue2",
                RoutingKey = "test2"
            };

            IProducer producer = factory.Open(settings);

            IConsumer consumer = factory.Connect(settings);

            string expectedString = "Hello world";

            // Act
            ReceiveData recievedData = null;
            string actualString = string.Empty;

            consumer.Received += (source, args) =>
            {
                recievedData = args;
                actualString = args.Message;
            };
            
            producer.Send(expectedString);

            // Assert
            Assert.NotEmpty(actualString);
            Assert.Equal(expectedString, actualString);

            consumer.SetAcknowledge(recievedData.DeliveryTag, true);
            consumer.Dispose();
            producer.Dispose();
        }
    }
}
