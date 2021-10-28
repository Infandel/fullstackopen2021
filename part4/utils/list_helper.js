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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}