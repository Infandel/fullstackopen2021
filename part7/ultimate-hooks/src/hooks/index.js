import { useState, useEffect} from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {

    const getAll = async () => {
      try {
        const response = await axios.get(baseUrl)
        setResources(response.data)
      } catch (e) {
        console.error(e)
      }
    }

    getAll()

  }, [baseUrl])

  const create = async (resource) => {
    try {
      const response = await axios.post(baseUrl, resource)
      setResources((prevResources) => prevResources.concat(response.data))
    } catch (e) {
      console.error(e)
    }
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}