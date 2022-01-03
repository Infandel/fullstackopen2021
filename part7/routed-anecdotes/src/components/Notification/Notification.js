import React from 'react';
import './Notification.css'

const Notification = ({ message }) => {
  return (
    <>
      {message
        ? <div className="success">{message}</div>
        : null
      }
    </>
  )
};

export default Notification;