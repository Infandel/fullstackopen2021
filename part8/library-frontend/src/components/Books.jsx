import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({ show, setError }) => {
  const [genres, setGenres] = useState([])
  const [genreHeader, setGenreHeader] = useState('')
  const [books, setBooks] = useState([])
  const { data, loading } = useQuery(ALL_BOOKS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    onError: (error) => {
      error.length === 1 ?
      setError(error.networkError?.result?.errors[0].message) :
      setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    const allGenres = []
    if (data) {
      data.allBooks.forEach(b => {
        allGenres.push(b.genres)
      })
      const oiSet = new Set(allGenres.flat(2))
      setGenres(Array.from(oiSet))
    }
  }, [data, show])

  const setGenre = (genre) => {
    if (genre) {
      chooseGenre(genre)
      const filteredBooks = data.allBooks.filter(b => {
        return b.genres.includes(genre)
      })
      setBooks(filteredBooks)
    } else {
      setBooks(data.allBooks)
    }
  }

  const chooseGenre = (genre) => {
    return genre ? setGenreHeader(genre) : setGenreHeader('')
  }

  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>
      {genreHeader !== '' ?
        <p>in genre <strong>{genreHeader}</strong></p>
        : null
      }
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.length === 0 ? (
            data.allBooks.map(b =>
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            )
          )
          : books.map(b =>
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
          )}
        </tbody>
      </table>
      {genres.map(genre =>
        <button key={genre} onClick={() => setGenre(genre)} >{genre}</button>
      )}
      <button onClick={() => setGenre()}>all genres</button>
    </div>
  )
}

export default Books