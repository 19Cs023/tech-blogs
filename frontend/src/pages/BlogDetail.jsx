import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Comments from '../components/Comments';
import './BlogDetail.css';
import defaultImage from '../assets/default-blogs.jpg';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        console.error('Error fetching blog details:', err);
        setError('Failed to load the article.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) return <div className="blog-detail-center">Loading article...</div>;
  if (error) return <div className="blog-detail-center error">{error}</div>;
  if (!blog) return <div className="blog-detail-center error">Article not found.</div>;

  return (
    <div className="blog-detail-container">
      <Link to="/" className="back-button">&larr; Back to Home</Link>
      
      <article className="blog-full-content">
        <div className="blog-image-wrapper">
          {blog.Image && <img src={blog.Image} alt={blog.title} className="blog-image" />}
          {!blog.Image && <img src={defaultImage} alt={blog.title} className="blog-image" />}
        </div>
        <header className="blog-header">
          <h1>{blog.title}</h1>
          <div className="blog-meta">
            <span className="blog-tag">{blog.tag}</span>
            <span className="blog-date">{new Date(blog.created).toLocaleDateString()}</span>
            {blog.recorded_by && <span className="blog-author">By {blog.recorded_by.name}</span>}
          </div>
        </header>
        
        <section className="blog-body" dangerouslySetInnerHTML={{ __html: blog.content }}>
        </section>
      </article>

      <hr className="divider" />
      
      <section className="blog-comments-section">
        <h2>Discussion</h2>
        <Comments />
      </section>
    </div>
  );
};

export default BlogDetail;