import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Passport } from 'mdi-material-ui'

// ** Axios Imports
import { apiCall } from 'src/configs/utils'

// ** Fetch product_advocates
export const fetchProductAdvocatesData = createAsyncThunk('product_advocates/fetchData', async params => {
  console.log('Check NEW', params.active_status)
  // if(params.active_status == "true" || params.active_status == "false"){
  let response = await apiCall('POST', 'fetch_product_advocates', {
    ...params,
    limit: params.page_size,
    page_num: params.page_num,
    status: params.active_status,
    name_email: params.name_email
  })
  // console.log('fetchProductAdvocatesData', response.data.body)

  return {
    totalRecords: response.data.body.total_records,
    result: response.data.body.result
  }
})

export const fetchProductAdvocateData = createAsyncThunk('product_advocate/fetchData', async params => {
  let response = await apiCall('POST', 'fetch_product_advocate', {
    ...params,
    id: params.id
  })
  console.log('fetchProductAdvocateData =>', response.data.body)

  return {
    totalRecords: response.data.body.total_records,
    result: response.data.body
  }
})

export const updateProductAdvocateStatus = createAsyncThunk(
  'product_advocates/update_product_advocate',
  async params => {
    let response = await apiCall('POST', 'update_product_advocate', params)
    return response
  }
)

export const updateProductAdvocateDosage = createAsyncThunk(
  'product_advocate/update_product_advocate',
  async params => {
    let response = await apiCall('POST', 'update_product_advocate', params)
    return response.data.body
  }
)

// ** Set is Loading True
export const setProductAdvocatesLoadingTrue = createAsyncThunk('product_advocates/isLoadingTrue', async params => {
  return true
})

export const setProductAdvocateLoadingTrue = createAsyncThunk('product_advocate/isLoadingTrue', async params => {
  return true
})

export const productAdvocatesSlice = createSlice({
  name: 'product_advocates',
  initialState: {
    data: [],
    jobsData: [],
    isLoading: false,
    totalRecords: 0,
    filter: {
      Active__c: '',
      ProductAdvocateValue: ''
    }
  },
  reducers: {
    onProductAdvocateStatusChangeHandler(state, action) {
      state.filter[action.payload.filter] = action.payload.value
    },
    onUpdateProductAdvocateStatusUpdateHandler(state, action) {
      state.data = action.payload.result
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchProductAdvocatesData.fulfilled, (state, action) => {
      const params = action.meta.arg
      console.log('PARA', params)
      if (params.active_status === 'true' || params.active_status === 'false') {
        state.data = action.payload.result
      } else {
        state.data = action.payload.result
        // state.data = [...state.data, ...action.payload.result];
      }
      state.isLoading = false
      state.totalRecords = action.payload.totalRecords
    })
    builder.addCase(setProductAdvocatesLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchProductAdvocateData.fulfilled, (state, action) => {
      const params = action.meta.arg
      state.jobsData = action.payload.result
      state.isLoading = false
      state.totalRecords = action.payload.totalRecords
    })
    builder.addCase(setProductAdvocateLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true
    })
  }
})

export const { onProductAdvocateStatusChangeHandler, onUpdateProductAdvocateStatusUpdateHandler } =
  productAdvocatesSlice.actions

export default productAdvocatesSlice.reducer
