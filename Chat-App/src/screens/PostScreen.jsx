import React, { useState, useEffect, useContext } from "react";
import { chatAppContext } from "../Context/ChatAppContext";

const PostScreen = ({ post }) => {
    const { currentUserAddress, likePost, commentOnPost } = useContext(chatAppContext);
    const [commentText, setCommentText] = useState("");
    const [imageUrl, setImageUrl] = useState("https://placehold.co/300x200"); // Fallback image
    const [isLiked, setIsLiked] = useState(false);

    const getRawHash = (imageHash) => {
        if (!imageHash) return null;
        // Handle full URLs like https:/gateway.pinata.cloud/ipfs/<hash> or https://gateway.pinata.cloud/ipfs/<hash>
        const match = imageHash.match(/ipfs\/(Qm[1-9A-Za-z]{44})/);
        return match ? match[1] : imageHash; // Return raw hash or original if no match
    };

    // Fetch image URL from JSON or use direct image URL
    useEffect(() => {
        const fetchImageData = async () => {
            if (!post.imageHash) {
                console.log("No imageHash provided for post:", post);
                return;
            }

            const rawHash = getRawHash(post.imageHash);
            console.log("Raw imageHash:", rawHash, "Original imageHash:", post.imageHash);

            // Try fetching JSON first
            try {
                console.log("Fetching JSON from:", `https://gateway.pinata.cloud/ipfs/${rawHash}`);
                const response = await fetch(`https://gateway.pinata.cloud/ipfs/${rawHash}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched JSON data:", data);
                    setImageUrl(data.image || data.imageUrl || "https://placehold.co/300x200");
                    return;
                } else {
                    console.error("Failed to fetch JSON:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching JSON:", error);
            }

            // If JSON fetch fails, try using imageHash as direct image URL
            console.log("Attempting direct image URL:", post.imageHash);
            setImageUrl(post.imageHash);
        };

        fetchImageData();
    }, [post.imageHash]);

    const handleLike = () => {
        likePost(post.owner, post.id);
    };

    const handleComment = () => {
        if (commentText.trim() === "") return;
        commentOnPost(post.owner, post.id, commentText);
        setCommentText("");
    };

    return (
        /*
        <div className="post-card">
            <p><strong>{post.owner}</strong></p>
            <p>{post.content}</p>
            {post.imageHash && (
                <img
                    src={imageUrl}
                    alt="Post"
                    onError={(e) => {
                        console.error("Image failed to load:", imageUrl);
                        e.target.src = "https://placehold.co/300x200";
                    }}
                />
            )}
            <p>Likes: {post.likes.length}</p>
            <button onClick={handleLike} aria-label="Like post">
                Like
            </button>
            <div>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    aria-label="Comment input"
                />
                <button onClick={handleComment} aria-label="Submit comment">
                    Comment
                </button>
            </div>
            <div>
                <h4>Comments:</h4>
                {post.comments.map((comment, index) => (
                    <p key={index}>
                        <strong>{comment.commenter}</strong>: {comment.commentText}
                    </p>
                ))}
            </div>
        </div>
        */
        <div className="post-card">
            {/* Post owner */}
            <div className="post-owner">
                <strong>{post.owner}</strong>
            </div>

            {/* Post content */}
            <p className="post-content">{post.content}</p>

            {/* Post image if available */}
            {post.imageHash && (
                <img
                    src={imageUrl}
                    alt="Post"
                    onError={(e) => {
                        console.error("Image failed to load:", imageUrl);
                        e.target.src = "https://placehold.co/300x200";
                    }}
                />
            )}

            {/* Likes and comments count */}
            <div className="post-stats">
                <div className="post-likes">
                    <span>{post.likes.length} Likes</span>
                </div>
                <div className="post-comments-count">
                    <span>{post.comments.length} Comments</span>
                </div>
            </div>

            {/* Action buttons */}
            <div className="post-actions">
                <button
                    onClick={handleLike}
                    className={`like-button ${isLiked ? 'active' : ''}`}
                    aria-label="Like post"
                >
                    Like
                </button>
                <button className="comment-button" aria-label="Comment on post">
                    Comment
                </button>
            </div>

            {/* Comment input */}
            <div className="comment-input-container">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    aria-label="Comment input"
                />
                <button
                    onClick={handleComment}
                    disabled={commentText.trim() === ""}
                    aria-label="Submit comment"
                >
                    Post
                </button>
            </div>

            {/* Comments section */}
            <div className="comments-section">
                <h4>Comments</h4>
                {post.comments.map((comment, index) => (
                    <div className="comment" key={index}>
                        <p>
                            <strong>{comment.commenter}</strong>
                            {comment.commentText}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostScreen;