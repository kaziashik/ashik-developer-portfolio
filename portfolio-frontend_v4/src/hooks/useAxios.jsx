import axios from 'axios'
import { API_BASE_URL } from '../config/env'

const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
})

export default function useAxios() {
  return axiosPublic
}
