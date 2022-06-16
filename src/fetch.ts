import axios from 'axios'

const fetch = axios.create({
  baseURL: 'https://apitest.mtd.se',
})

export default fetch
