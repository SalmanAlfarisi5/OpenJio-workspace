import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Style.css";

const Forum = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get("/api/comments");
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/comments",
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (replyContent.trim() === "") {
      alert("Reply cannot be empty");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/comments/${commentId}/replies`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyContent("");
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  return (
    <div className="Forum-page">
      <h1>Forum</h1>
      <div className="Forum-container">
        <div className="comments-section">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p>
                <strong>{comment.username}</strong> (
                {new Date(comment.created_at).toLocaleString()}):{" "}
                {comment.content}
              </p>
              <button onClick={() => setReplyingTo(comment.id)}>Reply</button>
              {replyingTo === comment.id && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReplySubmit(comment.id);
                  }}
                >
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <button type="submit">Post Reply</button>
                </form>
              )}
              {comment.replies &&
                comment.replies.map((reply) => (
                  <div key={reply.id} className="reply">
                    <p>
                      <strong>{reply.username}</strong> (
                      {new Date(reply.created_at).toLocaleString()}):{" "}
                      {reply.content}
                    </p>
                  </div>
                ))}
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit">Post Comment</button>
        </form>
        <button className="return-button" onClick={() => navigate("/home")}>
          return
        </button>
      </div>
    </div>
  );
};

export default Forum;
