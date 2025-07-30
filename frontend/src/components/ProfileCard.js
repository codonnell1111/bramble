// src/components/ProfileCard.js
import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './ProfileCard.css';

export default function ProfileCard({ showUpload = false }) {
  const { user, setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); 


  /* ───────── Upload logic ───────── */
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', user.id);

      const res = await axios.post(
        'http://localhost:3001/api/users/upload-avatar',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setUser({ ...user, avatar: res.data.avatar });
      setFile(null);
      setPreview(null);
      alert('Avatar updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload avatar.');
    } finally {
      setUploading(false);
    }
  };

  /* ───────── Sign-out ───────── */
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken('');
    navigate('/login');
  };

  /* ───────── Render ───────── */
  return (
    <div className="profile-card">
      <img
        src={
          user?.avatar
            ? `http://localhost:3001${user.avatar}`
            : 'https://api.dicebear.com/6.x/avataaars/svg?seed=Guest'
        }
        alt="avatar"
        className="profile-avatar"
      />

      <h3>{user?.username || 'Hello, guest!'}</h3>

      {user ? (
        <>
          {location.pathname !== '/profile' && (
            <button
              className="profile-link-button"
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>
          )}
          {showUpload && (
            <div className="upload-inline">
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: '70px', borderRadius: '8px', margin: '8px 0' }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="upload-btn"
              >
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          )}

          <button className="signout-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </>
      ) : (
        <>
          <p>Sign in to post & explore</p>
          <button
            className="signin-button"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            className="signin-button"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </>
      )}
    </div>
  );
}
