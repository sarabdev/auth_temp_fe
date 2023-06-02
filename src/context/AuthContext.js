// ** React Imports
import { createContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BASE_URL } from 'src/configs/config'
// ** Next Import
import { useRouter } from 'next/router'
// import { BASE_URL } from 'src/configs/config'
import toast from 'react-hot-toast'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import {
  setJobsLoadingTrue,
  fetchJobsData,
  setPrescribersLoadingTrue,
  fetchPrescribersData,
  setProductAdvocatesLoadingTrue,
  fetchProductAdvocatesData,
  fetchSamplesData
} from 'src/store/export'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState(defaultProvider.isInitialized)

  // ** Hooks
  const dispatch = useDispatch()

  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      setIsInitialized(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await axios.get(`${BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          .then(async response => {
            setLoading(false)
            const  userData  = response?.data
            console.log(userData)
             const role = 'admin'

            // if (userData?.roleId === 2) {
            //   role = 'admin'
            // }
            // if (userData?.roleId === 3) {
            //   role = 'client'
            // }

            const data = {
              id: userData?.id,
               role: 'admin',
              fullName: userData?.username,
              username: userData?.username,
              email: userData?.email
            }
            setUser({ ...data })
          }).catch((e)=>console.log(e))
        loadInitials()
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const loadInitials = () => {
    console.log('Initial point if I am logged in!')
    dispatch(setProductAdvocatesLoadingTrue())
    dispatch(setJobsLoadingTrue())
    dispatch(fetchProductAdvocatesData())
    dispatch(fetchJobsData())
    dispatch(fetchSamplesData())
  }

  const handleLogin = (params, errorCallback) => {
    console.log("I am here")
    console.log(params)
    axios
      .post(`${BASE_URL}/users/login`, params)
      .then(async res => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, res.data.token)
      })
      .then(() => {
        console.log("authme")
        console.log(window.localStorage.getItem(authConfig.storageTokenKeyName))
        axios
          .get(`${BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem(authConfig.storageTokenKeyName)}`
            }
          })
          .then(async response => {
            const returnUrl = router.query.returnUrl
            const userData = response.data
            const role = ''
            console.log(userData)
            // if (userData.roleId === 2) {
            //   role = 'admin'
            // }
            // if (userData.roleId === 3) {
            //   role = 'client'
            // }

            const data = {
              id: userData.id,
              role: 'admin',
              fullName: '',
              username: userData.username,
              email: userData.email
            }
            setUser({ ...data })
            window.localStorage.setItem('userData', JSON.stringify(data))
            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
            router.replace(redirectURL)
          })
        loadInitials()
      })
      .catch(err => {
        toast.error('Invalid username or password', {
          duration: 2000
        })
      })
  }

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch(err => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
