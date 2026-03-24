import mongoose from 'mongoose'
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Title is required'
  },
  tag: {
    type: String,
    trim: true,
    required: 'Tag is required'
  },
content: {  
    type: String,
    trim: true,
    required: 'Content is required'
  },
  incurred_on: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  recorded_by: {type: mongoose.Schema.ObjectId, ref: 'User'}
})

export default mongoose.model('Blog', BlogSchema)