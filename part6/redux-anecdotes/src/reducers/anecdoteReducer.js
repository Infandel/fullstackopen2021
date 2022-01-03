import anecdoteService from '../services/anecdote'

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      return state.map(anecdote =>
        anecdote.id !== action.data.id ? anecdote : action.data.updatedAnecdote)
        //Sorting anecdotes by voting property in desc order
          .sort((prevAnec, curAnec) => curAnec.votes - prevAnec.votes)
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'INIT_ANECDOTES':
      return action.data.sort((prevAnec, curAnec) => curAnec.votes - prevAnec.votes)
    default:
      return state
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }

}

export const makingVote = (id) => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const anecdoteToVote = anecdotes.find(a => a.id === id)
    const changedAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes += 1
    }
    const updatedAnecdote = await anecdoteService.updateVote(changedAnecdote, id)
    dispatch({
      type: 'VOTE',
      data: {
        updatedAnecdote,
        id
      }
    })
  }
}

export default anecdoteReducer