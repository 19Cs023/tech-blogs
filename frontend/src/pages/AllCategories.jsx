import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AllCategories.css';

const AllCategories = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        // Fetching all public blogs to display all categories
        const response = await axios.get('http://localhost:5000/api/blogs/all');
        setBlogs(response.data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load categories and articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBlogs();
  }, []);

  if (loading) return <div className="categories-center">Loading categories...</div>;
  if (error) return <div className="categories-center error">{error}</div>;

  // Extract unique tags/categories
  const categories = [...new Set(blogs.map(blog => blog.tag).filter(Boolean))];

  return (
    <div className="categories-container">
      <h2>All Categories</h2>
      <p className="categories-subtitle">Explore the latest tech articles by topic.</p>

      {categories.length === 0 ? (
        <div className="no-data">No categories available at the moment.</div>
      ) : (
        <div className="categories-list">
          {categories.map((category, index) => {
            const categoryBlogs = blogs.filter(b => b.tag === category);
            
            return (
              <div key={index} className="category-section">
                <h3 className="category-title">{category}</h3>
                <div className="category-articles">
                  {categoryBlogs.map(blog => (
                    <Link to={`/blogs/${blog._id}`} key={blog._id} className="category-article-card">
                      <h4>{blog.title}</h4>
                      <p>{(blog.content || '').substring(0, 80)}...</p>
                      <small>{new Date(blog.created).toLocaleDateString()}</small>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllCategories;