// src/components/PostCard.js
import React from 'react';
import './PostCard.css';

export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <div className="post-header">
        <strong>@{post.username || 'unknown'}</strong>
        {/*<span className="timestamp">{new Date(post.created_at).toLocaleString()}</span>*/}
      </div>
      <div className="post-content">
        <p>{post.content}</p>
        {/* Uncomment if you later support image posts */}
        {/* {post.image_url && <img src={post.image_url} alt="Post content" />} */}
      </div>
    </div>
  );
}
