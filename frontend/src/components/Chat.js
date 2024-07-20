import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("username"); // Get the current user's username

  useEffect(() => {
    // Fetch all users excluding the current user
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchUsers();
  }, [navigate]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    // Fetch messages with the selected user
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${user.username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchMessages();
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      try {
        const response = await axios.post(
          "/api/messages",
          {
            to: selectedUser.username,
            content: newMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages([...messages, response.data]);
        setNewMessage("");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        {users
          .filter((user) => user.username !== currentUser)
          .map((user) => (
            <div key={user.username} onClick={() => handleUserClick(user)}>
              <img
                src={user.profile_photo || "/Avatar.png"}
                alt={user.username}
                className="user-photo"
              />
              <span>{user.username}</span>
            </div>
          ))}
      </div>
      <div className="chat-window">
        {selectedUser ? (
          <>
            <div className="messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.from_user === selectedUser.username
                      ? "received"
                      : "sent"
                  }`}
                >
                  <span>{message.content}</span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="select-user">Select a user to chat with</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
