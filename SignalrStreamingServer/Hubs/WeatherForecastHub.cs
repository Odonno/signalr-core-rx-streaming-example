using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
using SignalrStreamingServer.Services;

namespace SignalrStreamingServer.Hubs
{
    public class WeatherForecastHub : Hub
    {
        private readonly RealtimeValuesService _realtimeValuesService;

        public WeatherForecastHub(RealtimeValuesService realtimeValuesService)
        {
            _realtimeValuesService = realtimeValuesService;
        }

        public IAsyncEnumerable<int> RealtimeWeather()
        {
            return _realtimeValuesService.Observe().ToAsyncEnumerable();
        }
    }
}
