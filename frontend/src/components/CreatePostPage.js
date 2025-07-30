// src/pages/CreatePostPage.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './CreatePostPage.css';

export default function CreatePostPage() {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      await axios.post('http://localhost:3001/api/posts', {
        userId: user.id,
        content: content.trim(),
      });
      alert('Post created!');
      setContent('');
      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-form">
        <div className="post-nav-buttons">
          <Link to="/" className="nav-button">Home</Link>
          <Link to="/profile" className="nav-button">Profile</Link>
        </div>
        <h2>Create a Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={6}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
