// src/pages/ExplorePage.js
import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProfileCard from '../components/ProfileCard';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './ExplorePage.css';

export default function ExplorePage() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [news, setNews] = useState([]);
  const { user } = useContext(AuthContext);


  useEffect(() => {
    async function fetchData() {
      try {
        const trendingRes = await axios.get('http://localhost:3001/api/posts/trending');
        const newUsersRes = await axios.get('http://localhost:3001/api/users/new');
        const topLikedRes = await axios.get('http://localhost:3001/api/posts/top-liked');
        const newsRes = await axios.get('http://localhost:3001/api/news');
        const suggestedRes = await axios.get(`http://localhost:3001/api/users/suggested?userId=${user.id}`);
        setSuggestedUsers(suggestedRes.data);
        setTrendingPosts(trendingRes.data);
        setNewUsers(newUsersRes.data);
        setTopLikedPosts(topLikedRes.data);
        setNews(newsRes.data);
      } catch (error) {
        console.error('Error fetching explore data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="explore-background">
      <Header />
      <div className="explore-page">
      <div clasName="explore-sidebar">
      <Sidebar />
      </div>
      <main className="explore-content">
        <section className="explore-box">
          <h2>🔥 Trending Posts</h2>
          {trendingPosts.map(post => (
            <div key={post.id} className="explore-post">
              <p><strong>@{post.username}</strong>: {post.content}</p>
            </div>
          ))}
        </section>

        <section className="explore-box">
          <h2>🌟 New Users</h2>
          {newUsers.map(user => (
            <div key={user.id} className="explore-user">
              <p>@{user.username}</p>
            </div>
          ))}
        </section>

        <section className="explore-box">
          <h2>👀 Suggested to Follow</h2>
          {suggestedUsers.map(user => (
            <div key={user.id} className="explore-user">
              <p>@{user.username}</p>
            </div>
          ))}
        </section>

        <section className="explore-box">
          <h2>❤️ Top Liked Posts</h2>
          {topLikedPosts.map(post => (
            <div key={post.id} className="explore-post">
              <p><strong>@{post.username}</strong>: {post.content}</p>
            </div>
          ))}
        </section>

        <section className="explore-box">
          <h2>📰 News & Updates</h2>
          {news.map(item => (
            <div key={item.id} className="explore-news">
              <p>{item.title}</p>
            </div>
          ))}
        </section>
      </main>
      <div className="explore-profile">
        <ProfileCard />
      </div>
      </div>
    </div>
  );
}
