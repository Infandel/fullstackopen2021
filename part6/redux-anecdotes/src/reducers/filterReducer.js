const filterReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_FILTER_PHRASE':
      const word = action.data.content
      return word ? word : ''
    default:
      return state
  }
}

export const filterPhrase = content => {
  return {
    type: 'SET_FILTER_PHRASE',
    data: { content },
  }
}

export default filterReducer