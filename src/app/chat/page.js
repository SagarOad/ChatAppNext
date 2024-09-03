// app/chat/page.js
"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function ChatPage() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socketInstance = io({
      path: "/api/socket", // Same as the path used on the server
    });

    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    // Listen for incoming messages
    socketInstance.on("message", (message) => {
      setChat((prevChat) => [...prevChat, message]);
    });

    setSocket(socketInstance);

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Function to send chat messages
  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("chatMessage", message);
      setMessage(""); // Clear the input field after sending
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div
        style={{
          border: "1px solid black",
          padding: "10px",
          height: "200px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {chat.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        style={{ marginRight: "10px" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
