import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import heroImage from '../assets/herotechblogs.jpg'; // Placeholder image path

function Hero() {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Get knowledge and Share knowledge</h1>
        <p className="hero-subtitle">
          get the knowlege you need and share the knowlege you have with others.
          you can write and read the tech article to improve your skills and share your experience with others.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">Get Started</Link>
          <Link to="/login" className="btn-secondary">Log In</Link>
        </div>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Tech Article Dashboard" />
      </div>
    </section>
  );
}

export default Hero;