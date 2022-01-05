import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, setBlogs, blogs, userId, setErrorMessage, onLikeClick }) => {

  const blogStyle = {
    padding: '10px',
    margin: '5px',
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: '10px',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    fontFamily: 'Arial, Helvetica, sans-serif',
  }
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  // Comparing the IDs of creator and current user to display
  // remove button
  const isRemovable = { display: userId === blog.user.id ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const increaseLike = (event) => {
    onLikeClick()
    event.preventDefault()
    const blogId = blog.id
    const chosenBlog = blogs.find(blog => blog.id === blogId)
    const blogObject = {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    blogService
      .update(blogId, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== chosenBlog.id ? blog : returnedBlog))
      })
      .catch(() => {
        setErrorMessage('Something wrong with updating the blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const removeBlog = () => {
    const blogId = blog.id
    if (window.confirm(`Do you want to remove blog ${blog.title} by ${blog.author} ?`)) {
      blogService
        .remove(blogId)
        .then(
          setBlogs(blogs.filter(blog => blog.id !== blogId))
        )
        .catch(() => {
          setErrorMessage('Something wrong with deleting the blog')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <li style={blogStyle} className="blog">
      <div style={hideWhenVisible} className="initialBlog">
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility} className="button small">View</button>
      </div>
      <div style={showWhenVisible} className="expandedBlog">
        <div>
          {blog.title} by {blog.author}
          <button onClick={toggleVisibility} className="button small">Hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          {blog.likes}
          <button onClick={increaseLike} className="button small">Like</button>
        </div>
        <div>{blog.user.name}</div>
        <div style={isRemovable}>
          <button onClick={removeBlog} className="button small danger">Remove</button>
        </div>
      </div>
    </li>
  )
}

Blog.propTypes = {
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  blog: PropTypes.object,
  userId: PropTypes.string.isRequired
}

export default Blog