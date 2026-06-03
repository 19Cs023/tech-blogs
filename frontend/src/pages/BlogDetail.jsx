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
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(response.data);
        setLikes(response.data.likes || 0);
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
const handleLike = async () => {
  try {
      const response = await axios.post(`http://localhost:5000/api/blogs/${id}/like`);
      setHasLiked(true);
      // Safety check: Make sure we actually got the likes property back
      if (response.data && response.data.likes !== undefined) {
        setLikes(response.data.likes);
        
        // Also update the full blog object state so it stays in sync
        setBlog(prevBlog => ({
           ...prevBlog,
           likes: response.data.likes
        }));
      }
      
    } catch (err) {
      console.error('Error liking the blog:', err);
    }
  };

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
        {hasLiked ? (
          <div className="blog-interactions" style={{ display: 'flex', gap: '8px', cursor: 'not-allowed', marginTop: '20px' }}>
            <button disabled className="like-button" style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'not-allowed', color: '#ff4d4f' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#ff4d4f">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span> Likes {likes}</span> 
            </button>
          </div>
        ) : (
        <div className="blog-interactions" style={{ display: 'flex', gap: '8px', cursor: 'pointer', marginTop: '20px' }}>
          <button onClick={handleLike} className="like-button" style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#ff4d4f">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          <span> Likes {likes}</span>
          </button>
        </div>
        )}
        <section className="blog-body" dangerouslySetInnerHTML={{ __html: blog.content }}>
        </section>
      </article>

      <hr className="divider" />
      
      <section className="blog-comments-section">
        <h2>Discussion</h2>
        <Comments blogId={id} />
      </section>
    </div>
  );
};

export default BlogDetail;