const initialState = {
  message: null,
}

let timeoutID // variable for prolonging notification timeout

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return {
      ...state,
      message: action.data.message,
    }
  case 'REMOVE_NOTIFICATION':
    return { ...initialState }
  default:
    return state
  }
}

export const showNotification = (message, delay) => {
  return async dispatch => {
    const timer = 1000 * delay
    dispatch({
      type: 'SET_NOTIFICATION',
      data: { message }
    })
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => dispatch({
      type: 'REMOVE_NOTIFICATION'
    }), timer)
  }
}

export default notificationReducer