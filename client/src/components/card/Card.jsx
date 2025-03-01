import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./card.scss";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext to get the current user

function Card({ item }) {
  const { currentUser } = useContext(AuthContext); // Get current user data
  const [comments, setComments] = useState([]); // State to store comments
  const [newComment, setNewComment] = useState(""); // State for new comment input

  // Load stored comments when the component mounts
  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem(`comments-${item.id}`)) || [];
    setComments(storedComments);
  }, [item.id]);

  // Handle adding a new comment
  const handleAddComment = () => {
    if (newComment.trim() && currentUser) {
      const newCommentObj = {
        text: newComment,
        username: currentUser.username || "Anonymous", // Use "Anonymous" if username is missing
        avatar: currentUser.avatar || "/default-avatar.png", // Default avatar if user has none
      };

      const updatedComments = [...comments, newCommentObj]; // Add new comment to the list
      setComments(updatedComments); // Update state
      localStorage.setItem(`comments-${item.id}`, JSON.stringify(updatedComments)); // Store in localStorage
      setNewComment(""); // Reset input field
    }
  };

  return (
    <div className="card">
      {/* Link to the item details page */}
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt={item.title} />
      </Link>

      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="Location Pin" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>

        {/* Features and action icons */}
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="Bed Icon" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="Bath Icon" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="Save Icon" />
            </div>
            <div className="icon">
              <img src="/chat.png" alt="Chat Icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Comment section */}
      <div className="commentSection">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Add Comment</button>

        {/* Display comments with username and avatar */}
        <div className="commentsList">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="comment">
                <img src={comment.avatar} alt={comment.username} className="commentAvatar" />
                <div className="commentText">
                  <strong>{comment.username}</strong>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
