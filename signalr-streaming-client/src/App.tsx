import React, { useEffect, useState } from 'react';
import './App.css';
import { HubConnectionBuilder, HttpTransportType, HubConnection } from '@microsoft/signalr';
import { Subject, interval } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const fromStream = <T extends any>(connection: HubConnection, streamName: string, ...args: any[]) => {
  const subject = new Subject<T>();
  connection.stream(streamName, ...args).subscribe(subject);
  return subject.asObservable();
};

const App: React.FC = () => {
  const [weather, setWeather] = useState<number | undefined>();

  useEffect(() => {
    const hubOptions = {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    };

    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:44308/weather", hubOptions)
      .build();

    connection.start()
      .then(() => {
        const subscription = fromStream<number>(connection, "realtimeWeather")
          .subscribe(value => setWeather(value));

        // random unsubscription
        interval(1000).pipe(
          map(_ => Math.random() * 100),
          filter(x => x > 90)
        ).subscribe(_ => {
          subscription.unsubscribe();
        })
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src="logo-weather.png" className="App-logo" alt="logo" />

        {weather === undefined &&
          <p>Waiting for incoming data...</p>
        }
        {weather !== undefined &&
          <p>
            <b style={{ fontSize: 66 }}>{weather}</b>
            <span> </span>
            <span style={{ fontSize: 32 }}>°C</span>
          </p>
        }
      </header>
    </div>
  );
}

export default App;
