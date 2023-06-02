import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { apiCall } from 'src/configs/utils'

// ** Fetch Jobs
export const fetchJobsData = createAsyncThunk('jobs/fetchData', async params => {
  let response = await apiCall('POST', 'fetch_jobs', {
    ...params,
    limit: params.page_size,
    page_num: params.page_num,
    status: params.status,
    product_advocate: params.product_advocate,
    start_date: params.start_date,
    end_date: params.end_date,
    meet_with: params.meet_with,
    prescriber: params.prescriber,
    lunch_meeting: params.lunch_meeting,
    radius: params.radius
  })

  return {
    totalRecords: response.data.body.total_records,
    result: response.data.body.result,
    LunchesSum: response.data.body.lunch_sum[0]['expr0']
  }
})

// ** Set is Loading True
export const setJobsLoadingTrue = createAsyncThunk('jobs/isLoadingTrue', async params => {
  return true
})

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    data: [],
    isLoading: false,
    totalRecords: 0,
    LunchesSum: 0,
    filter: {
      statusValue: '',
      productAdvocateValue: '',
      prescriberValue: '',
      startDateRange: '',
      endDateRange: '',
      dates: [],
      difference_location_doctor__c: '',
      question_2__c: [],
      meet_with: [],
      jobs_with_lunches_only: false,
      revisits: false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchJobsData.fulfilled, (state, action) => {
      state.data = action.payload.result
      state.isLoading = false
      state.totalRecords = action.payload.totalRecords
      state.LunchesSum = action.payload.LunchesSum
    })
    builder.addCase(setJobsLoadingTrue.fulfilled, (state, action) => {
      state.isLoading = true
    })
  }
})

export const { onJobFilterChangeHandler, onCancelJobHandler } = jobsSlice.actions

export default jobsSlice.reducer
