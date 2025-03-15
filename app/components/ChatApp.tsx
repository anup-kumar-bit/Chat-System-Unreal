"use client"
// components/ChatWindow.jsx
import { useEffect, useState } from "react";
import { FiSend, FiPlus } from "react-icons/fi";
import moment from "moment";
import { getCookie, deleteCookie } from "cookies-next";

interface Payload {
  username?: string;
  email?: string;
  phone?: string;
  role?: string;
}
const ChatApp = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [payload, setPayload] = useState<Payload>({});
  const [currentUser] = useState(payload.email); 

  useEffect(() => {
    const payloadCookie = getCookie("payload") as string;
    if (payloadCookie) {
      try {
        const parsedPayload = JSON.parse(payloadCookie);
        console.log(parsedPayload);
        setPayload(parsedPayload);
      } catch (error) {
        console.error("Failed to parse payload cookie:", error);
      }
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/chats");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMsg = async () => {
    if (!message.trim()) return;

    const newMessage = {
      by: payload.username,
      data: message.trim(),
      email: payload.email,
      at: moment().format('hh:mm:ss A')
    };

    try {
      await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });
      setMessage("");
      await fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    console.log("problem",currentUser)
  }, []);

  return (
    <div className="w-3/4 flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 bg-gray-50 border-b flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="ml-4">
          <h2 className="font-semibold">Chat Name</h2>
          <p className="text-sm text-gray-500">online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg: any) => (
          <div
            key={msg._id}
            className={`flex ${msg.email === payload.email ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${msg.email === payload.email
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border'
                }`}
            >
              <p className="text-sm">{msg.message}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-75">{msg.email}</span>
                <span className="text-xs opacity-75 ml-2">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <FiPlus size={24} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg mx-2 focus:outline-none focus:border-blue-500"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
          />
          {message.length > 0 && (
            <button
              className="p-2 text-blue-500 hover:text-blue-700"
              onClick={sendMsg}
            >
              <FiSend size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;