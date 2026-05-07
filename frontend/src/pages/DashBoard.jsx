import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DashBoard.css';

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
              <h3>{blog.title}</h3>
              <p className="blog-tag">Tag: {blog.tag}</p>
              <div className="blog-meta">
                <span>{new Date(blog.created).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashBoard;
