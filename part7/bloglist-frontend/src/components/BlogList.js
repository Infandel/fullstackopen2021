import React from 'react'
import Blog from './Blog'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'


const BlogList = ({ onLikeClick }) => {
  const blogs = useSelector(state => state.blogs)

  return (
    <div>
      <h1>Blogs</h1>
      <ul className="blogs">
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            blogs={blogs}
            onLikeClick={onLikeClick}
          />
        )}
      </ul>
    </div>
  )
}

BlogList.propTypes = {
  onLikeClick: PropTypes.func.isRequired,
  // handlePasswordChange: PropTypes.func.isRequired,
  // username: PropTypes.string.isRequired,
  // password: PropTypes.string.isRequired
}

export default BlogList