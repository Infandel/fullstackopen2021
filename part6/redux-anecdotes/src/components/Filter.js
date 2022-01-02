import React from 'react'
import { useDispatch } from 'react-redux'
import { filterPhrase } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    const content = event.target.value
    dispatch(filterPhrase(content))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter