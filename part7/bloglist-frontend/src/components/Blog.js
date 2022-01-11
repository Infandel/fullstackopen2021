import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { makingLike, deleteBlog } from '../reducers/blogReducer'
import { useParams } from 'react-router-dom'

const Blog = () => {

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

  const dispatch = useDispatch()
  const blogId = useParams().id
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)
  const blog = blogs.find(b => b.id === blogId)

  const increaseLike = (event) => {
    event.preventDefault()
    dispatch(makingLike(blog.id, blogs))
  }

  const removeBlog = () => {
    if (window.confirm(`Do you want to remove blog ${blog.title} by ${blog.author} ?`)) {
      dispatch(deleteBlog(blog.id))
    }
  }

  if (!blog) {
    return null
  }

  // Comparing the IDs of creator and current user to display
  // remove button
  const isRemovable = { display: user.id === blog.user.id ? '' : 'none' }

  return (
    <li style={blogStyle} className="blog">
      <div className="expandedBlog">
        <div>
          <h2>{blog.title} by {blog.author}</h2>
        </div>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>
          {blog.likes}
          <button onClick={increaseLike} className="button small">Like</button>
        </div>
        <div>added by {blog.user.name}</div>
        <div style={isRemovable}>
          <button onClick={removeBlog} className="button small danger">Remove</button>
        </div>
      </div>
    </li>
  )
}

Blog.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object),
  blog: PropTypes.objectOf(PropTypes.any),
}

export default Blog