import { useState, useEffect } from 'react'
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

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    const url = `https://restcountries.com/v2/name/${name}?fullText=true`;
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const getCountry = async () => {
      try {
        const response = await axios.get(url, { cancelToken: source.token });
        if (response.status === 200 && response.data[0]) {
          setCountry({ found: true, data: response.data[0] });
        } else {
          setCountry({ found: false, data: {} });
        }
      } catch (e) {
        console.log(e => e.message)
      }
    };
    if (name) {
      getCountry();
    }

    return () => {
      source.cancel();
    };
  }, [name])
  return country
}