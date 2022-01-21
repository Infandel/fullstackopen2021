import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select';

import { EDIT_AUTHOR } from '../queries'

const BirthYearForm = ({ setError, data, token }) => {
  const [name, setName] = useState('')
  const [setBornTo, setBorn] = useState('')

  const [ changeAuthor, result ] = useMutation(EDIT_AUTHOR, {
    errorPolicy: 'all',
    onError: (error) => {
      setError(error.networkError.result.errors[0].message)
    }
  })

  const submit = (event) => {
    event.preventDefault()
    changeAuthor({ variables: { name, setBornTo } })

    setName('')
    setBorn('')
  }

  const options = data.allAuthors.map(a => ({
    value: a.id,
    label: a.name
  }))

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError('author was not found')
    }
  }, [result.data]) // eslint-disable-line

  if (!token) {
    return null
  }

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <div>
          <span>{name}</span>
          <Select
            onChange={(e) => setName(e.label)}
            options={options}
          />
        </div>
        <div>
          born <input
            type='number'
            value={setBornTo}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default BirthYearForm