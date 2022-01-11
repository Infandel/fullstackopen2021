import blogService from '../services/blogs'
import { showNotification } from './notificationReducer'
import { logout } from './signedReducer'
import { toast } from 'react-toastify'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'LIKE':
    return state.map(blog => blog.id !== action.data.id ? blog : action.data.updatedBlog)
      //Sorting blogs by voting property in desc order
      .sort((prevBlog, curBlog) => curBlog.likes - prevBlog.likes)
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'INIT_BLOGS':
    return action.data.sort((prevBlog, curBlog) => curBlog.likes - prevBlog.likes)
  case 'DELETE_BLOG':
    return [...state].filter(blog => blog.id !== action.data.id)
      .sort((prevBlog, curBlog) => curBlog.likes - prevBlog.likes)
  default:
    return state
  }
}

const notify = (title, author) => toast(`A new blog ${title}! by ${author} added`)

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    if (newBlog) {
      notify(newBlog.title, newBlog.author)
      dispatch({
        type: 'NEW_BLOG',
        data: newBlog
      })
    } else {
      dispatch(showNotification('Something went wrong with input', 5))
      dispatch(logout())
    }
  }
}

export const makingLike = (id, blogs) => {
  return async dispatch => {
    try {
      const blogToLike = blogs.find(b => b.id === id)
      const changedBlog = {
        ...blogToLike,
        likes: blogToLike.likes += 1,
        user: blogToLike.user.id
      }
      const updatedBlog = await blogService.update(id, changedBlog)
      if (updatedBlog) {
        dispatch({
          type: 'LIKE',
          data: {
            updatedBlog,
            id
          }
        })
      } else {
        dispatch(showNotification('Something went wrong with increasing the likes', 5))
        dispatch(logout())
      }
    } catch (e) {
      console.warn(e)
    }
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    try {
      await blogService.remove(id)
      dispatch({
        type: 'DELETE_BLOG',
        data: {
          id
        }
      })
    } catch (e) {
      console.warn(e)
      dispatch(showNotification('Something went wrong with increasing the likes', 5))
      dispatch(logout())
    }
  }
}

export default blogReducer