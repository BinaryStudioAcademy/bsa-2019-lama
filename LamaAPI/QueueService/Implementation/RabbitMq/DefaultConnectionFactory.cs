namespace QueueService.Implementation.RabbitMq
{
    public class DefaultConnectionFactory : RabbitMQ.Client.ConnectionFactory
    {
        public DefaultConnectionFactory()
        {
            UserName = "guest";
            Password = "guest";
            VirtualHost = "/";
            HostName = "localhost";
        }
    }
}
