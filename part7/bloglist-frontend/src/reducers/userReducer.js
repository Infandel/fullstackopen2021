import userService from '../services/users'
import { showNotification } from './notificationReducer'

const usersReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_USERS':
    return action.data
  default:
    return state
  }
}


export const initializeUsers = () => {
  return async dispatch => {
    try {
      const users = await userService.getAll()
      dispatch({
        type: 'INIT_USERS',
        data: users,
      })
    } catch (e) {
      console.warn(e)
      dispatch(showNotification('Something went wrong with users initialization', 5))
    }
  }
}

export default usersReducer