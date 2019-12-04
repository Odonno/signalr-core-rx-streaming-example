import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { IStreamResult, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { Subject } from 'rxjs';

const fromStream = <T extends any>(stream: IStreamResult<T>) => {
  const subject = new Subject<T>();
  stream.subscribe(subject);
  return subject.asObservable();
};

const App: React.FC = () => {
  const [weather, setWeather] = useState<number | undefined>();

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:44308/weather", { skipNegotiation: true, transport: HttpTransportType.WebSockets })
      .build();

    connection.start()
      .then(() => {
        fromStream(
          connection.stream<number>("realtimeWeather")
        ).subscribe(value => setWeather(value));
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {weather === undefined &&
          <p>Waiting for incoming data...</p>
        }
        {weather !== undefined &&
          <p>
            Weather: <b>{weather}</b> °C
        </p>}
      </header>
    </div>
  );
}

export default App;
