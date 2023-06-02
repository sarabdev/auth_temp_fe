import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCall } from 'src/configs/utils'

export const fetchScanData = createAsyncThunk('/scan-details/fetchData', async params => {
  const { sort, sortColumn } = params

  console.log(params, sortColumn)

  let response = await apiCall('GET', 'scan-details/fetchData', {
    params: {
      sort: sort,
      column: sortColumn
    }
  })
  console.log('Dashboard Record', response.data)

  return {
    result: response.data
  }
})

export const scanDetailsSlice = createSlice({
  name: 'scanDetails',
  initialState: {
    data: [],
    isLoading: false
  },
  extraReducers: builder => {
    builder.addCase(fetchScanData.fulfilled, (state, action) => {
      state.data = action.payload.result
      state.isLoading = false
    })
    builder.addCase(fetchScanData.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchScanData.rejected, (state, action) => {
      state.isLoading = false
    })
  }
})

export default scanDetailsSlice.reducer
