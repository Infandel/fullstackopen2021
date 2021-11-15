const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
const mongoose = require('mongoose')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
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
    user: user._id
  })

  if (!body.url && !body.title) {
    response.status(400).end()
  } else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
  }  
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
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

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter