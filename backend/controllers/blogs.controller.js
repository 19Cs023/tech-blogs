import express from 'express';
const router = express.Router();
import Blogs from '../models/blogs.js';
import User from '../models/user.js';
import mongoose from 'mongoose';
const { get } = mongoose;
import extend from 'lodash/extend.js'


// Create a new blog
const create = async (req, res) => {
  try {
    req.body.recorded_by = req.auth._id
    const blog = new Blogs(req.body)
    await blog.save()
    return res.status(200).json(blog)
  } catch (err) {
    return res.status(400).json({
      error: err.message
    })
  }
}

const blogByID = async (req, res, next, id) => {
    try {
      let blog = await Blogs.findById(id).populate('recorded_by', '_id name').exec()
      if (!blog)
        return res.status('400').json({
          error: "Blog record not found"
        })
      req.blog = blog
      next()
    } catch (err){
      return res.status(400).json({
        error: err.message
      })
    }
}

const read = (req, res) => {
    return res.json(req.blog)
}

const listByUser = async (req, res) => {
  let firstDay = req.query.firstDay
  let lastDay = req.query.lastDay
  try {
    let query = { recorded_by: req.auth._id }
    if (firstDay && lastDay) {
      query.incurred_on = { $gte: firstDay, $lte: lastDay }
    }
    let blogs = await Blogs.find(query).sort('-incurred_on').populate('recorded_by', '_id name')
    res.json(blogs)
  } catch (err){
    console.log(err)
    return res.status(400).json({
      error: err.message
    })
  }
}

//get all blogs for current month
const currentMonthPreview = async (req, res) => {
  let firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  let lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)

  try {
    let blogs = await Blogs.find({
      incurred_on: { $gte: firstDay, $lte: lastDay },
      recorded_by: req.auth._id
    }).sort('-incurred_on').populate('recorded_by', '_id name')
    res.json(blogs)
  } catch (err){
    console.log(err)
    return res.status(400).json({
      error: err.message
    })
  }
}


// get by tags
const listByTags = async (req, res) => {
  let tags = req.query.tags?.split(',') || []
  try {
    let blogs = await Blogs.find({
      tags: { $in: tags },
      recorded_by: req.auth._id
    }).sort('-incurred_on').populate('recorded_by', '_id name')
    res.json(blogs)
  } catch (err){
    console.log(err)
    return res.status(400).json({
      error: err.message
    })
  }
}


//get by search query
const listBySearchQuery = async (req, res) => {
  let searchQuery = req.query.searchQuery
    try {
        let blogs = await Blogs.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } }
            ]
        }).sort('-incurred_on').populate('recorded_by', '_id name')
        res.json(blogs)
    } catch (err){
        console.log(err)
        return res.status(400).json({
            error: err.message
        })
    }
}

// get all public blogs
const list = async (req, res) => {
  try {
    let blogs = await Blogs.find().sort('-created').populate('recorded_by', '_id name')
    res.json(blogs)
  } catch (err) {
    return res.status(400).json({
      error: err.message
    })
  }
}




  const update = async (req, res) => {
    try {
      let blog = req.blog
      blog = extend(blog, req.body)
      blog.updated = Date.now()
      await blog.save()
      res.json(blog)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }
  
const remove = async (req, res) => {
    try {
      let blog = req.blog
      let deletedBlog = await Blogs.findByIdAndDelete(blog._id)
      res.json(deletedBlog)
    } catch (err) {
      return res.status(400).json({
        error: err.message
      })
    }
}

const hasAuthorization = (req, res, next) => {
  const authorized = req.blog && req.auth && req.blog.recorded_by._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

export default {
    create,
    blogByID,
    read,
    currentMonthPreview,
    listByTags,
    listBySearchQuery,
    listByUser,
    list,
    remove,
    update,
    hasAuthorization
}