// ** React Imports
import { createContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
// ** Next Import
import { useRouter } from 'next/router'
// import { BASE_URL } from 'src/configs/config'
import toast from 'react-hot-toast'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { ContentSaveAllOutline } from 'mdi-material-ui'


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
  const [returnUrl, setReturnUrl] = useState('')
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState(defaultProvider.isInitialized)

  // ** Hooks
  const dispatch = useDispatch()

  const router = useRouter()



  const redirectToLogin = () => {
    setUser(null)
    setIsInitialized(false)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.replace('/login')
  }

  useEffect(() => {
    if (router.isReady) {
      // Code using query
      console.log(router.query);
      //  window.localStorage.removeItem("returnUrl")
      if (router?.query?.returnUrl) {
        console.log("I am here")
        window.localStorage.setItem("returnUrl", router?.query?.returnUrl)
        setReturnUrl(router.query.returnUrl)
        //logout from here
        setUser(null)
        setIsInitialized(false)
        window.localStorage.removeItem('userData')
        window.localStorage.removeItem(authConfig.storageTokenKeyName)
      }
      // this will set the state before component is mounted
    }
  }, [router.isReady]);
  useEffect(() => {
    const initAuth = async () => {
      if (window.localStorage.getItem("returnUrl")) {
        redirectToLogin()
      }
      console.log("initi auth")
      //setReturnUrl(router.query.returnUrl)
      //console.log(router.query.returnUrl)
      setIsInitialized(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await axios.get(BASE_URL + "/users/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
          .then(async response => {
            setLoading(false)
            if (response?.data?.authError) {
              redirectToLogin()
              return
            }
            const userData = response?.data
            console.log(userData)
            let role = "App_User"
            for (const element of userData.access) {
              if (element.role.name === "Auth_Admin") {
                role = "Auth_Admin"
                break;
              }

              else if (element.role.name == "Super_Admin") {
                role = "Super_Admin"
                break; // Stop looping if role is found
              }
            }

            // if(role=="App_User" && window.localStorage.getItem("returnUrl")){
            //   console.log("I am here")
            //   router.replace(window.localStorage.getItem("returnUrl"))
            // }
            const data = {
              id: userData?.id,
              role: role,
              fullName: userData?.username,
              username: userData?.username,
              email: userData?.email,
              companyId: userData?.company?.id
            }
            setUser({ ...data, access: userData?.access })
            console.log(data)
            if (role == "App_User" && window.localStorage.getItem("returnUrl")) {
              router.replace(`${window.localStorage.getItem("returnUrl")}/token?token=${storedToken}`)

            }
            else {
              const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
              router.replace(redirectURL)
            }
          }).catch((e) => {
            redirectToLogin()
            return
          })
        loadInitials()
      } else {
        setLoading(false)
        redirectToLogin()
      }
    }
    if (router.isReady)
      initAuth()
  }, [router.isReady])

  const loadInitials = () => {

  }

  const handleLogin = (params, errorCallback) => {


    axios.post(BASE_URL + "/auth/login", params)
      .then(async res => {
        console.log(res)
        window.localStorage.setItem(authConfig.storageTokenKeyName, res.data.access_token)
      })
      .then(() => {
        axios
          .get(BASE_URL + "/users/me", {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem(authConfig.storageTokenKeyName)}`
            }
          })
          .then(async response => {
            //  const returnUrl = router.query.returnUrl
            const userData = response.data
            console.log(userData)
            let hasRequiredRole = false;
            let role = "App_User"
            for (const element of userData.access) {
              if (element.role.name === "Auth_Admin") {
                role = "Auth_Admin"
                break;
              }

              else if (element.role.name == "Super_Admin") {
                role = "Super_Admin"
                break; // Stop looping if role is found
              }
            }


            // if (userData.roleId === 2) {
            //   role = 'admin'
            // }
            // if (userData.roleId === 3) {
            //   role = 'client'
            // }
            console.log(userData)
            console.log(role)

            const data = {
              id: userData.id,
              role: role,
              fullName: '',
              username: userData.userName,
              email: userData.userEmail,
              companyId: userData?.company?.id
            }
            setUser({ ...data, access: userData.access })
            window.localStorage.setItem('userData', JSON.stringify(data))

            if (window.localStorage.getItem("returnUrl")) {
              router.replace(`${window.localStorage.getItem("returnUrl")}/token?token=${window.localStorage.getItem(authConfig.storageTokenKeyName)}`)
              window.localStorage.removeItem("returnUrl")
            }
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
