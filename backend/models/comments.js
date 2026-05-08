import mongoose from 'mongoose'
const CommentSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Title is required'
  },
  incurred_on: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    trim: true,
    required: 'Content is required'
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  blog_id: {type: mongoose.Schema.ObjectId, ref: 'Blog'},
  recorded_by: {type: mongoose.Schema.ObjectId, ref: 'User'}
})

export default mongoose.model('Comment', CommentSchema)