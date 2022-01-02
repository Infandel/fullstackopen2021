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
        message: action.message,
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

export const showNotification = message => {
  return {
    type: 'SET_NOTIFICATION',
    message: message,
  }
}

export const removeNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION'
  }
}

export default notificationReducer