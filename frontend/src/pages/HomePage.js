// frontend/pages/HomePage.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import PostCard from '../components/PostCard';
import './HomePage.css';

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Error fetching posts:', err));
  }, []);

  return (
    <div className="home-background">
      <Header />
      <Sidebar />

      <main className="home-page">
        <div className="feed">
          {posts.length === 0 ? (
            <p style={{ color: '#fff', textAlign: 'center', marginTop: '2rem' }}>
              No posts yet.
            </p>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>

        <div className="profile">
          <ProfileCard />
        </div>
      </main>
    </div>
  );
}
