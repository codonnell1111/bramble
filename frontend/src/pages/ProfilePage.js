// frontend/pages/ProfilePage.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ProfileCard from '../components/ProfileCard';
import PostCard from '../components/PostCard';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  /* fetch only this user's posts */
  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:3001/api/posts?userId=${user.id}`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Error loading posts', err));
  }, [user]);

  return (
    <div className="profile-page">
      <Sidebar />

      {/* Center feed */}
      <main className="feed-column">
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>

      {/* Right-side profile card (with upload) */}
      <aside className="profile-column">
        <ProfileCard showUpload />
      </aside>
    </div>
  );
}
