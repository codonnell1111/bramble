// src/components/Sidebar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
 // const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <img
        src="/uploads/logo1.png"
        alt="Bramble"
        className="sidebar-logo"
      />
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <div className="sidebar-post">
            <Link to="/create-post" className="sidebar-button">
                Create Post ➕
            </Link>
        </div>
      </nav>
    </div>
  );
}
