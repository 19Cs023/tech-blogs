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
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get('http://localhost:5000/api/blogs', config);
        setBlogs(response.data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load your blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [navigate]);

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, config);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete the blog.');
    }
  };

  if (loading) return <div className="dashboard-loading">Loading your dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>My Dashboard</h2>
        <button className="btn-create" onClick={() => navigate('/write')}>Create New Blog</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="blogs-grid">
        {blogs.length === 0 && !error ? (
          <div className="no-blogs">You haven't written any blogs yet. Start writing!</div>
        ) : (
          blogs.map(blog => (
            <div key={blog._id} className="blog-card">
              <h3>{blog.title}</h3>
              <p className="blog-tag">Tag: {blog.tag}</p>
              <p className="blog-excerpt">
                {(blog.content || '').length > 100 ? `${blog.content.substring(0, 100)}...` : blog.content}
              </p>
              <div className="blog-meta">
                <span>{new Date(blog.created).toLocaleDateString()}</span>
              </div>
              <div className="blog-actions">
                <button className="btn-edit" onClick={() => navigate(`/edit/${blog._id}`)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(blog._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashBoard;
