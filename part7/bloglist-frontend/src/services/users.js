import axios from 'axios'
const baseUrl = '/api/users'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data).catch(e => console.warn('get response from users', e))
}

export default {
  getAll
}