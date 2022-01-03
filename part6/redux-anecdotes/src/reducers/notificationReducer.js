const initialState = {
  message: '',
  style: {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: 'none'
  }
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        ...state,
        message: action.data.message,
        style: {
          ...state.style,
          display: ''}
        }
    case 'REMOVE_NOTIFICATION':
      return {...initialState}
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
    setTimeout(() => dispatch({
      type: 'REMOVE_NOTIFICATION'
    }), timer)
  }
}

export default notificationReducer