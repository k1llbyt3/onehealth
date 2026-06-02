import axios from 'axios'
import { auth } from './firebase'

// Create an Axios instance
const api = axios.create({
  // Point to the Flask backend URL defined in env variables, defaulting to localhost:5000
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Attach Firebase ID Token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

// Response Interceptor: Handle Global Errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global error states here (e.g., logging out user on 401)
    console.error('API Error:', error.response?.data?.message || error.message)
    return Promise.reject(error)
  }
)

export default api
