import React from 'react'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'center'
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Blog-lists app. Infandel Inc.</em>
    </div>
  )
}

export default Footer