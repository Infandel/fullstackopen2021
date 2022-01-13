import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  // if (notification.message === null) {
  //   return null
  // }

  return (
    <div>
      {(notification.message &&
        <Alert severity="error">
          {notification.message}
        </Alert>
      )}
    </div>
  )
}

export default Notification