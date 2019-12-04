using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Linq;

namespace SignalrStreamingServer.Hubs
{
    public class WeatherForecastHub : Hub
    {
        private static readonly BehaviorSubject<int> _values = new BehaviorSubject<int>(0);
        private static readonly Random _random = new Random();

        static WeatherForecastHub()
        {
            Observable.Interval(TimeSpan.FromSeconds(1)).Subscribe(_ =>
            {
                int value = (int)(_random.NextDouble() * 30);
                _values.OnNext(value);
            });
        }

        public IAsyncEnumerable<int> RealtimeWeather()
        {
            return _values.ToAsyncEnumerable();
        }
    }
}
