// app/chat/page.js
"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socketInstance = io({
      path: "/api/socket",
    });

    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    socketInstance.on("message", (message) => {
      setChat((prevChat) => [...prevChat, message]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Chat Room</h1>

      <div
        className="flex-1 overflow-y-scroll p-4 bg-white rounded-lg shadow-md"
        style={{ height: "70vh" }}
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              index % 2 === 0 ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-white ${
                index % 2 === 0 ? "bg-blue-500" : "bg-gray-500"
              }`}
            >
              {msg}
            </div>
          </div>
        ))}
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
}
