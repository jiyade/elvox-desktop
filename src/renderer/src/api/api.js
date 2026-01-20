import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000
})

export const setDeviceToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Timeout error
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      toast.error('Request timeout. Please try again', {
        id: 'timeout-error'
      })
      return Promise.reject(error)
    }

    // Network error (offline)
    if (!error.response && !navigator.onLine) {
      toast.error('No internet connection', { id: 'no-internet-error' })
      return Promise.reject(error)
    }

    // Network error (server unreachable)
    if (!error.response) {
      toast.error('Cannot reach server. Please check your connection', {
        id: 'network-error'
      })
      return Promise.reject(error)
    }

    // Session expired / unauthorized
    if (error.response?.status === 401 && !error.response?.data?.error) {
      toast.error('System authorization lost. Please reactivate', {
        id: 'session-expired'
      })
      // Trigger session expired event for app-wide handling
      window.dispatchEvent(new CustomEvent('session-expired'))
    }

    // Server error
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again', {
        id: 'server-error'
      })
    }

    return Promise.reject(error)
  }
)

export default api
