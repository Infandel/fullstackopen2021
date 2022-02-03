import React, { useState } from 'react'
import { useMutation, useSubscription, } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS, BOOK_ADDED } from '../queries'
import { toast } from 'react-toastify'

const NewBook = ({ show, setError, client }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const notify = (title, author) => toast(`A new book ${title}! by ${author} has been added`)

  const [ createBook ] = useMutation(CREATE_BOOK, {
    // refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    errorPolicy: 'all',
    onError: (error) => {
      setError(error.networkError.result.errors[0].message)
    },
    // Updating cache with the request callback itself (No Subscription)
    // update: (store, response) => {
      // try {
      //   const booksInStore = store.readQuery({ query: ALL_BOOKS })
      //   store.writeQuery({
      //     query: ALL_BOOKS,
      //     data: {
      //       ...booksInStore,
      //       allBooks: [ ...booksInStore.allBooks, response.data.addBook ]
      //     }
      //   })
      // } catch(error) {
      //   console.error(error);
      // }
    //   try {
    //     const authorsInStore = store.readQuery({ query: ALL_AUTHORS })
    //     store.writeQuery({
    //       query: ALL_AUTHORS,
    //       data: {
    //         ...authorsInStore,
    //         allAuthors: [ ...authorsInStore.allAuthors, response.data.addBook.author ]
    //       }
    //     })
    //   } catch(error) {
    //     console.error(error);
    //   }
    // }
  })
  // Updating the cache only thanks to the graphQL Subscriptions
  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(b => b.id).includes(object.id)

    try {
      const bookDataInStore = client.readQuery({ query: ALL_BOOKS })
      if (!includedIn(bookDataInStore.allBooks, addedBook)) {
        client.writeQuery({
          query: ALL_BOOKS,
          data: { allBooks: bookDataInStore.allBooks.concat(addedBook) }
        })
      }
    } catch(error) {
      console.error(error)
    }
    try {
      const authorDataInStore = client.readQuery({ query: ALL_AUTHORS })
      if (!includedIn(authorDataInStore.allAuthors, addedBook.author)) {
        client.writeQuery({
          query: ALL_AUTHORS,
          data: { allAuthors: authorDataInStore.allAuthors.concat(addedBook.author) }
        })
      } else {
        const authorToFind = authorDataInStore.allAuthors.find(a => a.id === addedBook.author.id)
        const updatedAuthor = {
          ...authorToFind,
          bookCount: addedBook.author.bookCount += 1,
        }
        client.writeQuery({
          query: ALL_AUTHORS,
          data: { allAuthors: authorDataInStore.allAuthors.map(author => author.id !== addedBook.author.id ? author : updatedAuthor) }
        })
      }
    } catch(error) {
      console.error(error)
    }

  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(addedBook.title, addedBook.author.name)
      updateCacheWith(addedBook)
    }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    createBook({ variables: { title, author, published, genres } })

    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
