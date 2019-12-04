import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import signalR from '@microsoft/signalr';

const App: React.FC = () => {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44308/weatherforecast")
      .build();

    connection.on("send", data => {
      console.log(data);
    });

    connection.start()
      .then(() => connection.invoke("send", "Hello"));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
