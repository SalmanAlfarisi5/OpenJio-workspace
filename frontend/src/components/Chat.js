import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../Style.css";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = parseInt(localStorage.getItem("user_id"), 10);

  useEffect(() => {
    const fetchUsers = async () => {
      const targetUserId = location.state?.targetUserId;

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
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`/api/messages/${user.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const filteredMessages = response.data.filter((msg) => msg.timestamp && new Date(msg.timestamp).toString() !== "Invalid Date");
          setMessages(filteredMessages);
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

  useEffect(() => {
    let intervalId;
    if (selectedUser) {
      intervalId = setInterval(async () => {
        if (messages.length > 0) {
          const lastTimestamp = messages[messages.length - 1].timestamp;
          try {
            const response = await axios.get(
              `/api/messages/${selectedUser.id}/since/${lastTimestamp}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            const newMessages = response.data.filter((msg) => msg.timestamp && new Date(msg.timestamp).toString() !== "Invalid Date");

            // Filter out any duplicates
            const updatedMessages = newMessages.filter(
              (msg) =>
                !messages.some((existingMsg) => existingMsg.id === msg.id)
            );

            if (updatedMessages.length > 0) {
              setMessages((prevMessages) => [
                ...prevMessages,
                ...updatedMessages,
              ]);
            }
          } catch (error) {
            console.error("Error fetching new messages:", error);
          }
        }
      }, 2000); // Fetch new messages every 2 seconds
    }
    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [selectedUser, messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "" || image) {
      const formData = new FormData();
      formData.append("to", selectedUser.id);
      formData.append("content", newMessage || "");
      if (image) {
        formData.append("image", image);
      }

      try {
        const response = await axios.post("/api/messages", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessages([...messages, response.data]);
        setNewMessage("");
        setImage(null);
      } catch (error) {
        console.error("Error sending message:", error);
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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
    document.getElementById("imageModal").style.display = "block";
  };

  const closeModal = () => {
    setModalImage(null);
    document.getElementById("imageModal").style.display = "none";
  };

  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};
    messages.forEach((message) => {
      const date = new Date(message.message_date).toDateString();
      if (new Date(message.message_date).toString() !== "Invalid Date") {
        if (!groupedMessages[date]) {
          groupedMessages[date] = [];
        }
        groupedMessages[date].push(message);
      }
    });
    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="chat-container">
      <div className="user-list">
        <button className="return-button" onClick={() => navigate("/home")}>
          Return
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
              {Object.keys(groupedMessages).map((date) => (
                <div key={date}>
                  <div className="date-separator">{date}</div>
                  {groupedMessages[date].map((message) => (
                    <div
                      key={message.id}
                      className={`message ${
                        message.from_user === currentUser ? "sent" : "received"
                      }`}
                    >
                      {message.content && <span>{message.content}</span>}
                      {message.image_url && (
                        <img
                          src={message.image_url}
                          alt="Sent"
                          className="chat-image"
                          onClick={() => handleImageClick(message.image_url)}
                        />
                      )}
                      <span className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
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
              <input type="file" onChange={handleImageChange} />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="select-user">Select a user to chat with</div>
        )}
      </div>

      <div id="imageModal" className="modal">
        <span className="close" onClick={closeModal}>&times;</span>
        {modalImage && (
          <img className="modal-content" src={modalImage} alt="Full view" />
        )}
      </div>
    </div>
  );
};

export default Chat;
