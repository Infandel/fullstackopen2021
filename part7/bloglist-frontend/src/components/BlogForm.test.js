import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm /> ', () => {
  let component

  const blogs = [
    {
      title: 'Awesome journey',
      author: 'Charles B',
      url: 'www.bbc.com',
    },
    {
      title: 'Kinky konke',
      author: 'Kranjel B',
      url: 'www.hbm.com',
    },
    {
      title: 'Yolanda Jobs',
      author: 'Angela C',
      url: 'www.isw.com',
    },
  ]

  const setBlogs = jest.fn()
  const toggleVisibility = jest.fn()
  const handleSubmit = jest.fn()

  beforeEach(() => {
    component = render(
      <BlogForm
        setBlogs={setBlogs}
        blogs={blogs}
        toggleVisibility={toggleVisibility}
        onSubmit={handleSubmit}
      />
    )
  })

  test('received props with the right details and calls onSubmit', () => {
    const inputAuthor = component.getByTestId('author')
    const inputTitle = component.getByTestId('title')
    const inputUrl = component.getByTestId('url')
    const form = component.getByTestId('form')

    fireEvent.change(inputAuthor, {
      target: { value: 'Bill Murray' }
    })
    fireEvent.change(inputTitle, {
      target: { value: '10 steps to success' }
    })
    fireEvent.change(inputUrl, {
      target: { value: 'www.github.com' }
    })

    fireEvent.submit(form)

    expect(handleSubmit).toHaveBeenCalledWith({
      author: 'Bill Murray',
      title: '10 steps to success',
      url: 'www.github.com'
    })
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})