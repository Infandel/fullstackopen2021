const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog)).map(blog => blog.save())
  await Promise.all(blogObjects)  
})

describe('addition of a new blog', () => {
  test.only('succeeds with a valid data', async () => {
    const newBlog = {
      title: "Top 3 movies of the year",
      author: "Joe Black",
      url: "https://fullstackopen.com/en/part4/testing_the_backend",
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYxOGViN2UzOWRmOGYwYmU3NWFhMjVmYSIsImlhdCI6MTYzNzAwMTI3NiwiZXhwIjoxNjM3MDExMjc2fQ.S4WLzUwCJNaGQWW25eK7QpZiDd5DbE6GUOIBo55vB-U")
      .send(newBlog)
      .expect(200)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(
      'Top 3 movies of the year'
    )
  }, 10000)

  test('fails without title and url props', async () => {
    const newBlog = {
      author: "John Snow",
      likes: '7'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('with missing likes prop will set likes to 0 by default', async () => {
    const newBlog = {
      title: "50 Shades of fabulous me",
      author: "John Snow",
      url: "https://adventofcode.com/2015/day/7",
    }
    
    const addedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
  
    expect(addedBlog.body.likes).toEqual(0)
  })

  test('returns all blogs', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('checking for a particular property', () => {
  test('shows that the unique identifier property of the blogs is named id', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map(r => r.id)
  
    expect(ids).toBeDefined()
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
  
    expect(resultBlog.body).toEqual(processedBlogToView)
  })
})

describe('deletion of a blog', () => {
  test('leads to success of operation with a proper Id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
  
    const titles = blogsAtEnd.map(r => r.title)
  
    expect(titles).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})