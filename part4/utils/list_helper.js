const dummy = (blogs) => {
  return 1
}

const totalLikes = (array) => {
  return array.reduce((sum, blog) => sum + blog.likes, 0)
}

function favoriteBlog(array) {
  return array.reduce((favBlog, currentBlog) =>
    (currentBlog.likes > favBlog.likes ? currentBlog : favBlog), array[0])  
}

function mostBlogs(arrayOfBlogs) {
  // Making list of Authors
  const firstStep = arrayOfBlogs.map(blogObject => {
    return blogObject.author
  });
  // Made shallow copy of unique authors using Set
  const fancyAuthorsSet = new Set(firstStep)
  const bigBlogGuy = { blogs: 0 }
  // Turned that to Array and iterating through that
  Array.from(fancyAuthorsSet).forEach(authorCreds => {
    let counter = [...firstStep].filter(author => author === authorCreds).length
    // Making if-statement comparing for biggest blogs amount per author
    if (counter > bigBlogGuy.blogs) {
      bigBlogGuy.author = authorCreds
      bigBlogGuy.blogs = counter
    }
  });
  return bigBlogGuy.blogs === 0 ? undefined : bigBlogGuy
}

function mostLikes(array) {
  if (array.length === 0) return
  const biggestLikesBlog = array.reduce((favBlog, currentBlog) =>
    (currentBlog.likes > favBlog.likes ? currentBlog : favBlog), array[0])
  const { author, likes } = biggestLikesBlog
  return { author, likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}