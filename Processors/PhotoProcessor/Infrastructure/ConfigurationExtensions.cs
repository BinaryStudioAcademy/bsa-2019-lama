using Microsoft.Extensions.Configuration;

namespace PhotoProcessor.Infrastructure
{
    internal static class ConfigurationExtensions
    {
        public static T Bind<T>(this IConfiguration configuration, string key)
            where T : class, new()
        {
            var objectToBind = new T();
            configuration.Bind(key, objectToBind);
            return objectToBind;
        }
    }
}
