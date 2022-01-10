import React from 'react'
import Blog from './Blog'
import { useSelector } from 'react-redux'


const BlogList = ({ userId, onLikeClick }) => {
  const blogs = useSelector(state => state.blogs)

  return (
    <div>
      <h1>Blogs</h1>
      <ul className="blogs">
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            userId={userId}
            blog={blog}
            blogs={blogs}
            onLikeClick={onLikeClick}
          />
        )}
      </ul>
    </div>
  )
}

export default BlogList