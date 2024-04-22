import React, { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    let websocket = new WebSocket(
      "wss://social-network.samuraijs.com/handlers/chatHandler.ashx"
    );

    //@ts-ignore
    window.socket = websocket;

    websocket.onmessage = function (event) {
      console.log("Получены данные " + event.data);
    };
  }, []);
  return <div className="App"></div>;
}

export default App;
