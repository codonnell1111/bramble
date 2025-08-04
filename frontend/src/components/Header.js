// frontend/components/Header.js
import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="bramble-header">
      <h1>
        <img
          src="uploads/logo1.png"
          alt="B"
          className="bramble-logo"
        />ramble
      </h1>
    </header>
  );
}
