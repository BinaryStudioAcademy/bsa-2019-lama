namespace Services.Implementation.RabbitMq
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
        public DefaultConnectionFactory(Models.ConnectionSettings connectionSettings)
        {
            UserName = connectionSettings.UserName;
            Password = connectionSettings.Password;
            VirtualHost = connectionSettings.VirtualHost;
            HostName = connectionSettings.HostName;
        }
    }
}
