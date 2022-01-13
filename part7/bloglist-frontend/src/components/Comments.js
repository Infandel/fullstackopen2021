import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { createComment } from '../reducers/blogReducer'
import { TextField } from '@material-ui/core'

const Comments = ({ blog }) => {
  const dispatch = useDispatch()
  const [newComment, setNewComment] = useState('')

  const addComment = (event) => {
    try {
      event.preventDefault()
      const commentObject = {
        content: newComment,
      }
      dispatch(createComment(blog.id, commentObject))
      setNewComment('')
    } catch (exception) {
      console.log(blog.id)
      console.warn(exception)
    }
  }
  if (!blog.comments) {
    return null
  }
  return (
    <div>
      <h3>Comments</h3>
      <form onSubmit={addComment}>
        <TextField
          label='comment'
          type="text"
          value={newComment}
          onChange={({ target }) => setNewComment(target.value)}
        />
        <div>
          <button type="submit" className="button">add comment</button>
        </div>
      </form>
      <ul className="blogs">
        {blog.comments.map(comment =>
          <li key={comment.id}>
            {comment.content}
          </li>
        )}
      </ul>
    </div>
  )
}

Comments.propTypes = {
  blog: PropTypes.object,
}

export default Comments