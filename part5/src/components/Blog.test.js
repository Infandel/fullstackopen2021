import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('<Blog />', () => {
  let component

  const blog = {
    title: 'The Adventure',
    author: 'Dwayne Rock Johnson',
    url: 'www.jes.jp',
    user: {
      id: '2828ahhap2228s',
      name: 'Johhny',
      username: 'root'
    }
  }

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

  const user = {
    id: '2828ahhap2228s',
    name: 'Johhny',
    username: 'root'
  }

  const mockHandler = jest.fn()
  const mockHandler2 = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog
        userId={user.id}
        blog={blog}
        setBlogs={mockHandler}
        blogs={blogs}
        setErrorMessage={mockHandler2}
      />
    )
  })

  test('at start blog renders only shrinked blog version', () => {
    const initialBlog = component.container.querySelector('.initialBlog')
    const expandedBlog = component.container.querySelector('.expandedBlog')

    expect(initialBlog).not.toHaveStyle('display: none')
    expect(expandedBlog).toHaveStyle('display: none')
    expect(initialBlog).not.toHaveTextContent('www.jes.jp')
    expect(initialBlog).not.toHaveTextContent('Like')
  })

  test('that blogs url and number of likes are shown when show button clicked', () => {
    const shrinkedDiv = component.container.querySelector('.initialBlog')
    const expandedDiv = component.container.querySelector('.expandedBlog')

    const button = component.getByText('View')
    fireEvent.click(button)

    console.log(prettyDOM(expandedDiv))

    expect(shrinkedDiv).toHaveStyle('display: none')
    expect(expandedDiv).not.toHaveStyle('display: none')
    expect(expandedDiv).toHaveTextContent('www.jes.jp')
    expect(expandedDiv).toHaveTextContent('Like')
  })
})

