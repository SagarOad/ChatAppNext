"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function ChatComponent() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socketInstance = io();

    socketInstance.on("connect", () => {
      console.log("Connected to chat server");
    });

    // Listen for incoming messages
    socketInstance.on("message", (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    setSocket(socketInstance);

    // Cleanup the socket connection on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Function to send chat messages
  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("chatMessage", message);
      setMessage("");  // Clear the input field after sending the message
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div style={{ height: "200px", overflowY: "scroll", border: "1px solid black", marginBottom: "10px" }}>
        {chat.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
