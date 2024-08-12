import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../Style.css";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = parseInt(localStorage.getItem("user_id"), 10);

  useEffect(() => {
    const fetchUsers = async () => {
      const targetUserId = location.state?.targetUserId;

      // we used chat gpt helps for this
      try {
        const response = await axios.get("/api/chat-users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            targetUserId,
          },
        });

        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Unexpected response data:", response.data);
          setUsers([]);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          console.error("Error fetching users:", error);
        }
      }
    };
    fetchUsers();
  }, [navigate, location.state]);

  const handleUserClick = useCallback(
    (user) => {
      setSelectedUser(user);
      // Fetch messages with the selected user
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`/api/messages/${user.id}`, {
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
    },
    [navigate]
  );

  // we used chat gpt helps for this
  useEffect(() => {
    const targetUserId = location.state?.targetUserId;
    if (targetUserId && users.length > 0) {
      const targetUser = users.find(
        (user) => user.id === parseInt(targetUserId)
      );
      if (targetUser) {
        handleUserClick(targetUser);
      }
    }
  }, [location.state, users, handleUserClick]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      try {
        const response = await axios.post(
          "/api/messages",
          {
            to: selectedUser.id,
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <button className="return-button" onClick={() => navigate("/home")}>
          return
        </button>
        <hr></hr>
        {users
          .filter((user) => user.id !== currentUser)
          .map((user) => (
            <div key={user.id} onClick={() => handleUserClick(user)}>
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
                    message.from_user === currentUser ? "sent" : "received"
                  }`}
                >
                  <span>{message.content}</span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            <form className="message-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="select-user">Select a user to chat with</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
