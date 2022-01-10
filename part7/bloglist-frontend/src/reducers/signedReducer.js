import loginService from '../services/login'
import blogService from '../services/blogs'
import { showNotification } from './notificationReducer'

const initialState = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
    return user
  } else {
    return null
  }
}

const signedReducer = (state = initialState(), action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.data
  case 'CLEANSE_USER':
    return null
  default:
    return state
  }
}

export const login = (username, password) => {
  return async dispatch => {
    try {
      const signedUser = await loginService.login({
        username, password,
      })
      if (signedUser) {
        window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(signedUser)
        )
        await blogService.setToken(signedUser.token)
        dispatch ({
          type: 'SET_USER',
          data: signedUser
        })
      } else {
        dispatch(showNotification('Wrong username or password', 5))
      }
    } catch (exception) {
      console.warn(exception)
    }
  }
}

export const logout = () => {
  return dispatch => {
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      dispatch ({
        type: 'CLEANSE_USER',
      })
    } catch (e) {
      console.warn(e)
      dispatch(showNotification('Something wrong with logging out', 5))
    }
  }
}

export default signedReducer