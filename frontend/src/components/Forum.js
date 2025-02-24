import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../Style.css";

const Forum = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Use the state passed from ForumCategories to get the displayName, fall back to "Forum" if undefined
  const categoryTitle = location.state?.displayName || "Forum";

  const fetchComments = useCallback(async () => {
    try {
      console.log(`Fetching comments for category: ${categoryTitle}`);
      const response = await axios.get(
        `/api/comments?tag=${encodeURIComponent(categoryTitle)}`
      );
      console.log("Fetched comments:", response.data); // Debug log
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [categoryTitle]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      console.log(`Posting new comment with tag: ${categoryTitle}`);
      await axios.post(
        "/api/comments",
        { content: newComment, tag: categoryTitle },
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
      <div className="Forum-container">
        <h1>{categoryTitle}</h1>{" "}
        {/* This will now dynamically display the category title */}
        <div className="comments-section">
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>
                  <strong>{comment.username}</strong> (
                  {new Date(comment.created_at).toLocaleString()}):{" "}
                  {comment.content}
                </p>
                <button
                  className="reply-button"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  <img src="../reply.png" alt="Reply" />
                </button>
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
            ))
          )}
        </div>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit">Post Comment</button>
        </form>
        <button
          className="return-button"
          onClick={() => navigate("/forum-categories")}
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default Forum;
