import React, { KeyboardEvent, ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { log } from "console";

type Message = {
  userId: number;
  userName: string;
  message: string;
  photo: string;
};

const detectUrl = (message: string) => {
  const expression =
    /(https:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/gi;
  const regex = new RegExp(expression);
  const t = "www.google.com";

  return message.replace(expression, "<a href='$1'>$1</a>");
};

console.log(detectUrl("ghbdtn http://www.dasdsf.com cfs33adsa"));

function App() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [websocket, setWebSocket] = useState<WebSocket | null>(null);

  const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  };
  const onSendMessage = () => {
    websocket?.send(value);
    setValue("");
  };
  const onKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.code === "Enter") {
      onSendMessage();
    }
  };
  useEffect(() => {
    let websocket = new WebSocket(
      "wss://social-network.samuraijs.com/handlers/chatHandler.ashx"
    );

    setWebSocket(websocket);

    websocket.onmessage = function (event) {
      const messagesFromServer = JSON.parse(event.data);
      setMessages((messages) => [...messagesFromServer.reverse(), ...messages]);
      // console.log("Получены данные " + event.data);
    };
  }, []);

  return (
    <div className="App">
      <div
        style={{
          width: "300px",
          height: "300px",
          overflowY: "scroll",
          border: "1px solid black",
        }}
      >
        {messages &&
          messages.map((m, i) => (
            <div key={i}>
              {m.userName}:{" "}
              <span
                dangerouslySetInnerHTML={{ __html: detectUrl(m.message) }}
              ></span>
            </div>
          ))}
      </div>
      <div>
        <textarea
          value={value}
          onChange={onChangeValue}
          onKeyPress={onKeyPress}
        />
        <button onClick={onSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
