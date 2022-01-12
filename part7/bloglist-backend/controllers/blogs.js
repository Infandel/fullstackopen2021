const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const middleware = require('../utils/middleware')
const mongoose = require('mongoose')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('comments', { content: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  if (!request.token || !request.decodedToken.id) {
    response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: []
  })

  if (!body.url && !body.title) {
    response.status(400).end()
  } else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    const blogWithNestedUser = await Blog.findById(savedBlog._id).populate('user')
    response.json(blogWithNestedUser)
  }
})

blogsRouter.post('/:id/comments', middleware.userExtractor, async (request, response) => {
  const body = request.body
  if (!request.token || !request.decodedToken.id) {
    response.status(401).json({ error: 'token missing or invalid' })
  }
  const comment = new Comment({
    content: body.content,
  })

  const savedComment = await comment.save()

  const blogWithNewComment = await (await Blog.findByIdAndUpdate(request.params.id, { $push: { comments: savedComment } }, { new: true })).populate('comments')
  if (blogWithNewComment) {
    console.log(blogWithNewComment)
    response.json(blogWithNewComment)
  } else {
    response.status(404).end()
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).json({ error: 'failed on adding new comment' })
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  if (!request.token || !request.decodedToken.id) {
    response.status(401).json({ error: 'token is missing or invalid' })
  }
  if (mongoose.Types.ObjectId.isValid(request.params.id)) {
    const blog = await Blog.findById(request.params.id)
    const user = request.user
    if (blog && user) {
      const userId = user._id.toString()
      const userIdInBlog = blog.user.toString()
      if (userId === userIdInBlog) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
      } else {
        response.status(401).json({ error: 'this blog does not belong to you' })
      }
    } else if (!user) {
      response.status(401).json({ error: 'user is missing or invalid' })
    } else if (!blog) {
      response.status(404).json({ error: 'blog is missing or invalid' })
    }
  } else {
    response.status(404).json({ error: 'this blog does not exist' })
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body

  if (!request.token || !request.decodedToken.id) {
    response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog =  {
    likes: body.likes || 0,
    user: body.user
  }
  const updatedBlog = await (await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })).populate('comments')
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter