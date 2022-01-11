import React from 'react'
import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'


const BlogList = () => {
  const blogs = useSelector(state => state.blogs)

  return (
    <div>
      <h1>Blogs</h1>
      <ul className="blogs">
        {blogs.map(blog =>
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

// BlogList.propTypes = {
// onLikeClick: PropTypes.func.isRequired,
// handlePasswordChange: PropTypes.func.isRequired,
// username: PropTypes.string.isRequired,
// password: PropTypes.string.isRequired
// }

export default BlogList