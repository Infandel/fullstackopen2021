describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'root',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('[data-testid=username]').type('root')
      cy.get('[data-testid=password]').type('salainen')
      cy.get('[data-testid=login-button]').click()
      cy.contains('Matti Luukkainen logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('[data-testid=username]').type('root')
      cy.get('[data-testid=password]').type('wrong')
      cy.get('[data-testid=login-button]').click()
      cy.get('.error').should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'Matti Luukkainen logged-in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'salainen' })
    })

    it('a new blog can be created', function() {
      cy.contains('new Blog').click()
      cy.get('[data-testid=title]').type('You do not know JS')
      cy.get('[data-testid=author]').type('Smart Guy')
      cy.get('[data-testid=url]').type('www.js.com')
      cy.contains(/Create$/)
      cy.contains(/Create$/).click()
        .should('not.be.visible')

      cy.contains('You do not know JS')
      cy.contains('Smart Guy')
    })

    describe('blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Star Wars',
          author: 'Lucas Arts',
          url: 'www.nevermakeasequel.com',
        })
      })

      it('can be liked', function () {
        cy.contains('Star Wars')
          .contains('View')
          .click()
        cy.get('.expandedBlog')
          .contains('Like')
          .click()
        cy.get('.expandedBlog')
          .contains('1')
      })

      it('can be deleted by the guy who created it', function () {
        cy.contains('Star Wars')
          .contains('View')
          .click()
        cy.contains('Remove')
          .click()
        cy.get('.blogs')
          .should('not.contain', 'Star Wars')
      })

      it('cannot be deleted by other guys', function () {
        const user = {
          name: 'Jimmy',
          username: 'admin',
          password: '123'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.contains(/Log out$/).click()
        cy.login({ username: 'admin', password: '123' })
        cy.contains('Jimmy logged-in')
        cy.contains('Star Wars')
          .contains('View')
          .click()
        cy.contains('Remove')
          .should('not.be.visible')
      })
    })

    describe('blogs exists', function() {
      beforeEach(function () {
        cy.createBlog({
          title: 'Star Wars',
          author: 'Lucas Arts',
          url: 'www.nevermakeasequel.com',
        })
        cy.createBlog({
          title: 'Holly molly',
          author: 'Ronald Talkien',
          url: 'www.talktomuch.com',
        })
        cy.createBlog({
          title: 'Incredible stories',
          author: 'Charles DIkkens',
          url: 'www.englishliterature.en',
        })
      })

      it.only('ordered according to likes with the most likes being first', function() {
        const likesArray = []
        cy.contains('www.talktomuch.com').parent().contains('Like').as('likeButtonInHollyBlog')
        cy.contains('www.englishliterature.en').parent().contains('Like').as('likeButtonInStoriesBlog')
        cy.contains('Holly molly')
          .contains('View')
          .click()
        cy.get('@likeButtonInHollyBlog').click()
        cy.wait(1000)
        cy.get('@likeButtonInHollyBlog').click()
        cy.wait(1000)
        cy.contains('Incredible stories')
          .contains('View')
          .click()
        cy.get('@likeButtonInStoriesBlog').click()
        cy.wait(1000)
        cy.get('@likeButtonInStoriesBlog').click()
        cy.wait(1000)
        cy.get('@likeButtonInStoriesBlog').click()
        cy.wait(1000)
        cy.get('.blog').then((blog) => {
          blog.map((i, blog) => {
            const wholeBlogAsArray = blog.innerText.split('\n')
            console.log(wholeBlogAsArray)
            // third element of array is the number of likes with "Like" button
            if (wholeBlogAsArray[2]) {
              const correctedLikesVersion = Number(wholeBlogAsArray[2].replace('Like', ''))
              likesArray.push(correctedLikesVersion)
            } else {
              likesArray.push(0)
            }
          })
          expect(likesArray).to.have.ordered.members([3, 2, 0])
        })
      })
    })
  })
})