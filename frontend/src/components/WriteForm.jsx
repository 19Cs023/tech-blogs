//no-ts-check
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './WriteForm.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const WriteForm = ({ existingBlog: propBlog }) => {
  const { id } = useParams();
  const [existingBlog, setExistingBlog] = useState(propBlog || null);
  const [title, setTitle] = useState(propBlog ? propBlog.title : '');
  const [tag, setTag] = useState(propBlog ? propBlog.tag : '');
  const [content, setContent] = useState(propBlog ? propBlog.content : '');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id && !propBlog);
  const navigate = useNavigate();

  const modules = {
       toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean'] // removes formatting
  ],
};
  useEffect(() => {
    const fetchBlog = async () => {
      if (id && !propBlog) {
        try {
          const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
          const blog = response.data;
          setExistingBlog(blog);
          setTitle(blog.title);
          setTag(blog.tag);
          setContent(blog.content);
        } catch (_err) {
          if (_err.response && _err.response.status === 404) {
            setError('Blog not found for editing.');
          } else {
            setError('Failed to load blog for editing.');
          }
        } finally {
          setFetching(false);
        }
      }
    };
    fetchBlog();
  }, [id, propBlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simple validation
    if (!title.trim() || !tag.trim() || !content.trim()) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to post.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const formData = new FormData();
      formData.append('title', title);
      formData.append('tag', tag);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      if (existingBlog) {
        await axios.put(`http://localhost:5000/api/blogs/${existingBlog._id}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/blogs', formData, config);
      }
      
      navigate('/dashboard'); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred while saving the blog.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="write-form-container">Loading editor...</div>;

  return (
    <div className="write-form-container">
      <h2>{existingBlog ? 'Edit Blog' : 'Write a New Blog'}</h2>
      
      {error && <div className="write-error">{error}</div>}

      <form onSubmit={handleSubmit} className="write-form">
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter blog title" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Tag</label>
          <input 
            type="text" 
            value={tag} 
            onChange={(e) => setTag(e.target.value)} 
            placeholder="e.g., Technology, React, Node.js" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImage(e.target.files[0])} 
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent} 
            style={{ height: '300px', marginBottom: '50px' }}
            modules={modules}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : (existingBlog ? 'Update Blog' : 'Publish Blog')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteForm;
