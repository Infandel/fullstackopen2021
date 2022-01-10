import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { makingLike, deleteBlog } from '../reducers/blogReducer'

const Blog = ({ blog, blogs, onLikeClick }) => {

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
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  console.log(user)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  // Comparing the IDs of creator and current user to display
  // remove button
  const isRemovable = { display: user.id === blog.user.id ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const increaseLike = (event) => {
    onLikeClick()
    event.preventDefault()
    dispatch(makingLike(blog.id, blogs))
  }

  const removeBlog = () => {
    if (window.confirm(`Do you want to remove blog ${blog.title} by ${blog.author} ?`)) {
      dispatch(deleteBlog(blog.id))
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
  blogs: PropTypes.array.isRequired,
  blog: PropTypes.object,
  // userId: PropTypes.string.isRequired
}

export default Blog