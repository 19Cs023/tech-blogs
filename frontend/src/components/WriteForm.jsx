import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './WriteForm.css';

const WriteForm = ({ existingBlog: propBlog }) => {
  const { id } = useParams();
  const [existingBlog, setExistingBlog] = useState(propBlog || null);
  const [title, setTitle] = useState(propBlog ? propBlog.title : '');
  const [tag, setTag] = useState(propBlog ? propBlog.tag : '');
  const [content, setContent] = useState(propBlog ? propBlog.content : '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id && !propBlog);
  const navigate = useNavigate();

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
        } catch (err) {
          setError('Failed to load blog for editing.');
        } finally {
          setFetching(false);
        }
      }
    };
    fetchBlog();
  }, [id, propBlog]);

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.innerHTML);
  };

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
          Authorization: `Bearer ${token}`
        }
      };

      const blogData = { title, tag, content };

      if (existingBlog) {
        await axios.put(`http://localhost:5000/api/blogs/${existingBlog._id}`, blogData, config);
      } else {
        await axios.post('http://localhost:5000/api/blogs', blogData, config);
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
          <label>Content</label>
          <div className="toolbar">
            <button type="button" onClick={() => handleFormat('bold')}><b>B</b></button>
            <button type="button" onClick={() => handleFormat('italic')}><i>I</i></button>
            <button type="button" onClick={() => handleFormat('underline')}><u>U</u></button>
            <button type="button" onClick={() => handleFormat('insertUnorderedList')}>List</button>
            <button type="button" onClick={() => handleFormat('formatBlock', 'H3')}>H3</button>
          </div>
          
          <div 
            className="editor-content"
            contentEditable={true}
            onInput={handleContentChange}
            suppressContentEditableWarning={true}
            style={{ minHeight: '300px', border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}
            dangerouslySetInnerHTML={{ __html: content }} // Initialize with existing content
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
