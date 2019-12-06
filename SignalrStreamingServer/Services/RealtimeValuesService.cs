using System;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace SignalrStreamingServer.Services
{
    public class RealtimeValuesService
    {
        private static readonly BehaviorSubject<int> _values = new BehaviorSubject<int>(0);
        private static readonly Random _random = new Random();

        public RealtimeValuesService()
        {
            Observable.Interval(TimeSpan.FromSeconds(1)).Subscribe(_ =>
            {
                int value = (int)(_random.NextDouble() * 30);
                _values.OnNext(value);
            });
        }

        public IObservable<int> Observe()
        {
            return _values;
        }
    }
}
