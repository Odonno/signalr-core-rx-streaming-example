using Microsoft.AspNetCore.SignalR;
using RxSignalrStreams.Extensions;
using SignalrStreamingServer.Services;
using System.Threading.Channels;

namespace SignalrStreamingServer.Hubs
{
    public static class ObservableExtensions
    {
    }

    public class WeatherForecastHub : Hub
    {
        private readonly RealtimeValuesService _realtimeValuesService;

        public WeatherForecastHub(RealtimeValuesService realtimeValuesService)
        {
            _realtimeValuesService = realtimeValuesService;
        }

        public ChannelReader<int> RealtimeWeather()
        {
            return _realtimeValuesService.Observe()
                .ToNewestValueStream(Context.ConnectionAborted);
        }
    }
}
