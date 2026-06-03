import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DashBoard.css';
import defaultImage from '../assets/default-blogs.jpg';

const DashBoard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      
      try {
        const response = await axios.get('http://localhost:5000/api/blogs/all')
        setBlogs(response.data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [navigate]);

  if (loading) return <div className="dashboard-loading">Loading blogs...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>All Blogs</h2>
        <button className="btn-create" onClick={() => navigate('/write')}>Create New Blog</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      <div className="blogs-grid">
        {blogs.length === 0 && !error ? (
          <div className="no-blogs">No blogs found. Start writing!</div>
        ) : (
          blogs.map(blog => (
            <div key={blog._id} className="blog-card" onClick={() => navigate(`/blogs/${blog._id}`)}>
              {blog.Image && <img src={blog.Image} alt={blog.title} className="blog-image" />}
              {!blog.Image && <img src={defaultImage} alt={blog.title} className="blog-image" />}
              <h3>{blog.title}</h3>
              <p className="blog-tag">Tag: {blog.tag}</p>
              <div className="blog-meta">
                <span>By: {blog.recorded_by.name}</span>
                <span>{new Date(blog.created).toLocaleDateString()}</span>
                  <span className="blog-likes-display" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff4d4f' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                        {blog.likes || 0}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashBoard;
