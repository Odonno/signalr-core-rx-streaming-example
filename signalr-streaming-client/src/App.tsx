import React, { useEffect, useState } from 'react';
import './App.css';
import { HubConnectionBuilder, HttpTransportType, HubConnection, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

const fromStream = <T extends any>(connection: HubConnection, streamName: string, ...args: any[]) => {
  return new Observable<T>(
    observer => {
      const stream = connection.stream(streamName, ...args)
      const subscription = stream.subscribe(observer);

      return () => subscription.dispose();
    }
  ).pipe(
    share()
  );
};

const App: React.FC = () => {
  const [weather, setWeather] = useState<number | undefined>();

  useEffect(() => {
    const hubOptions = {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
      logger: LogLevel.Trace
    } as IHttpConnectionOptions;

    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:44308/weather", hubOptions)
      .build();

    connection.start()
      .then(() => {
        fromStream<number>(connection, "realtimeWeather")
          .subscribe(value => setWeather(value));
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
