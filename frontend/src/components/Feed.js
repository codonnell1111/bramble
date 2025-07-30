import React from 'react';
import PostCard from './PostCard';
import './Feed.css';

export default function Feed() {
  // later we’ll pass posts as props or fetch from API
  return (
    <div className="feed">
      <PostCard />
      <PostCard />
    </div>
  );
}
