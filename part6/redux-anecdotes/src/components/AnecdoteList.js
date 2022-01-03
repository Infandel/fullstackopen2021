import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makingVote } from '../reducers/anecdoteReducer'
import { removeNotification, showNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const anecdotesToShow = filter
    ? anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    : anecdotes

  const vote = (id, content) => {
    dispatch(makingVote(id))
    dispatch(showNotification(`voted for '${content}'`, 5))
  }

  return(
    <>
      {anecdotesToShow.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote.id, anecdote.content)}
        />
      )}
    </>
  )
}

export default Anecdotes