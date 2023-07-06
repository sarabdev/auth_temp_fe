import axios from 'axios'
const  BASE_URL=process.env.NEXT_PUBLIC_BASE_URL
// import { BASE_URL } from 'src/configs/config' // Replace with your actual API URL
const BASE_URL2=`${process.env.NEXT_PUBLIC_BASE_URL}/users`


// Login endpoint
export const login = async (email, password) => {
  try {
  
    const response = await axios.post(`${BASE_URL2}/login`, { email, password })
    // const { accessToken } = response.data
    const {token} =response.data;
    return token;
  } catch (error) {
    throw error
  }
}

// Register endpoint
export const register = async (email, password, username) => {
  try {
    
    const response = await axios.post(`${BASE_URL2}/signup`, { email, password, username })
    const {token} = response.data
     return {error:false}
    // return token
  } catch (error) {
    console.log(error.response)
    return {error:true,message:error?.response?.data?.message}
    // throw error
  }
}

// Me endpoint
export const getMe = async token => {
  try {
    const role = ''
    const response = await axios.get(`${BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    const  userData  = response.data
    // if (userData.roleId === 2) {
    //   role = 'admin'
    // }
    // if (userData.roleId === 3) {
    //   role = 'client'
    // }

    const data = {
      id: userData.id,
       role: 'admin',
      fullName: 'Mirza Abubakr',
      username: 'abubakr',
      email: userData.email
    }

    return data
  } catch (error) {
    throw error
  }
}
