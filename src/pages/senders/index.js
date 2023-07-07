// ** React Imports
import { useEffect, useState, useCallback } from 'react'
import { statesData } from 'src/store/states';
// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
const  BASE_URL=process.env.NEXT_PUBLIC_BASE_URL
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import moment from 'moment/moment'
import toast from 'react-hot-toast'

// ** ThirdParty Components
import axios from 'axios'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

const TableServerSide = () => {
  // ** State
  const [isLoading,setIsLoading]=useState(false)
  const [state,setState]=useState({
    platform:'',
    nickname:'',
    fullname:'',
    email:'',
    address:'',
    country:'',
    state:'',
    city:'',
    zip:''
    
  })
  const platforms=[{label:"Sendgrid",value:"sendgrid"},{label:"Salesforce", value:"salesforce"}]
  const countries=['USA']
  const [cities,setCities]=useState([])
  const [filteredCities,setFilteredCities]=useState([])
  const [states,setStates]=useState([])
  const [filteredStates,setFilteredStates]=useState([])
  const [email,setEmail]=useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('userId')
  const [sort, setSort] = useState('asc')
  const [open, setOpen] = useState(false)
  const [productData, setProductData] = useState([])
  const [userDetails, setUserDetails] = useState([])

  const handleClose = () =>{ setOpen(false)
  clearState()
  }

  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  const clearState=()=>{
    setState({
      platform:'',
      nickname:'',
      fullname:'',
      email:'',
      address:'',
      country:'',
      state:'',
      city:'',
      zip:''
      
    })
  }

  const fetchTableData = useCallback(
    async (sort, column) => {
      setIsLoading(true)
      try{
      await axios.get(BASE_URL+"/sender",{headers:{
            Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
          }})
        .then(res => {
          setTotal(res.data.length)
          setRows(loadServerRows(page, res.data))
          setIsLoading(false)
        })
      }
      catch(e){
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  )
  useEffect(() => {
    fetchTableData(sort, sortColumn)
  }, [fetchTableData, sort, sortColumn])

  const handleSelected=async(id,platform)=>{
    try{
    let response=await axios.post(BASE_URL+"/sender/deleteSender",{id,platform},{headers:{
      Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
    }})

    if(!response?.data?.error){ 
      toast.success(response?.data?.message, {
        duration: 2000
      })
       fetchTableData()
    }
    else
    toast.error(response?.data?.message, {
      duration: 2000
    })
   }
   catch(e){
    toast.error("Try again!", {
      duration: 2000
    })
   }
  }

  const fetchCities=async()=>{
    try{
    const response=await axios.get(BASE_URL+"/cities",{
      headers: {
        Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
      }
    });
    setCities(response.data)
    setFilteredCities(response.data.slice(0,20))
    }
    catch(e){
      fetchCities()
    }
    
  }

  const fetchStates=async()=>{
    try{
      // const response=await axios.get(`${BASE_URL}/states`);
      setStates(statesData)
      setFilteredStates(statesData.slice(0,20))

      }
      catch(e){
        fetchStates()
      }
     }

  useEffect(()=>{
     fetchCities()
     fetchStates()
  },[])

  const handleSearchCountry=(event)=>{
    setState({
      ...state, country:event.target.value
    })
  }

  const handleSearchState=(event)=>{
    const searchText = event.target.value;
    setState({...state,state:searchText})
    const filteredOptions = states.filter((option) =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredStates(filteredOptions);
  }

  const handleSearchTextChange = (event) => {
    const searchText = event.target.value;
    setState({...state,city:searchText})

    const filteredOptions = cities.filter((option) =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );
    const limitedOptions = filteredOptions.slice(0, 20);
    setFilteredCities(limitedOptions);
  };

  const columns = [
    
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Nickname',
      field: 'nickname',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.nickname}
        </Typography>
      )

    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Email',
      field: 'email',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.email}
        </Typography>
      )

    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Platform',
      field: 'platform',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.platform}
        </Typography>
      )

    },
    {
      flex:0.2,
      minWidth:140,
      headerName:'Action',
      field:'action',
      renderCell:params=>(
        <Button variant='contained' onClick={()=>handleSelected(params.row.id,params.row.platform)} >Delete</Button>
      )
    }
    
    
  ]

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('userId')
    }
  }

  const handleOptionChange=(e,value,field)=>{
    setState({
      ...state,
      [field]:value ? value.value :''
    })
  }

  const handleChange=(e)=>{
    setState({
      ...state,
      [e.target.name]:e.target.value
    })
  }

  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    handleClose()
    try{
      let response=await axios.post(BASE_URL+"/sender",{...state},{headers:{
          Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
        }})

  
      if(!response?.data?.error){ 
        toast.success(response?.data?.message, {
          duration: 2000
        })
        // fetchTableData()
      }
      else
      toast.error(response?.data?.message, {
        duration: 2000
      })
      }
      catch(error){
        toast.error(error?.response?.data?.message, {
          duration: 2000
        })
      }
  }

  return (
    <>
      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>Add Sender</DialogTitle>
        <form onSubmit={handleSubmit} >

        <FormControl sx={{mb:1, width:400, padding:5}}>
           <Autocomplete
                
                 value={{label:state.platform,value:state.platform}}
                 onChange={(e,value)=>handleOptionChange(e,value,'platform')}
                 options={platforms?.map(item =>({value: item.value, label: item.label}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         required
                         {...params}
                         onChange={handleSearchState}
                         label="Select platform"
                         variant="standard"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
           </FormControl>
            <FormControl sx={{ width:300,padding:5,mb:1 }}>
              <TextField required type='text' value={state.nickname} onChange={handleChange} id="standard-basic" name="nickname" label="nickname" placeholder='Enter nickname' variant="standard" />
            </FormControl>
            <FormControl sx={{ width:300,padding:5,mb:1 }}>
              <TextField required type='text' value={state.fullname} onChange={handleChange} id="standard-basic" name="fullname" label="fullname" placeholder='Enter fullname' variant="standard" />
            </FormControl>
            <FormControl sx={{ width:300,padding:5,mb:1 }}>
              <TextField required type='email' value={state.email} onChange={handleChange} id="standard-basic" name="email" label="email" placeholder='Enter an email' variant="standard" />
            </FormControl>
            <FormControl sx={{ width:300,padding:5,mb:1 }}>
              <TextField required type='text' value={state.address} onChange={handleChange} id="standard-basic" name="address" label="address" placeholder='Enter address' variant="standard" />
            </FormControl>
            <FormControl sx={{ width:300, padding:5, mb:1 }}>
            <Autocomplete
                 value={{label:state.country,value:state.country}}
                 onChange={(e,value)=>handleOptionChange(e,value,'country')}
                 options={countries?.map(item =>({value: item, label: item}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         required
                         {...params}
                         onChange={handleSearchCountry}
                         label="Select a country"
                         variant="standard"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
           
            <FormControl sx={{mb:1, width:300, padding:5}}>
           <Autocomplete
                
                 value={{label:state.state,value:state.state}}
                 onChange={(e,value)=>handleOptionChange(e,value,'state')}
                 options={filteredStates?.map(item =>({value: item.name, label: item.name}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         required
                         {...params}
                         onChange={handleSearchState}
                         label="Select an state"
                         variant="standard"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
           </FormControl>

           <FormControl sx={{ width:300,padding:5,mb:1 }}>
              <TextField required type='text' value={state.city} onChange={handleChange} id="standard-basic" name="city" label="city" placeholder='Enter city' variant="standard" />
            </FormControl>

            <FormControl sx={{ width:300,padding:5,mb:3 }}>
              <TextField required type='text' value={state.zip} onChange={handleChange} id="standard-basic" name="zip" label="zipcode" placeholder='Enter zipcode' variant="standard" />
            </FormControl>
     


        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Discard</Button>
          <Button type='submit' variant='contained'>Add</Button>

        </DialogActions>
        </form>    
      </Dialog>
      <Card>
        <CardHeader title='Senders' 
        action={
            <Box>
              <Button size='small' variant='contained' onClick={()=>setOpen(true)}>
                Add Sender
              </Button>
            </Box>
          }
        />
        <DataGrid
          autoHeight
          pagination
          rows={isLoading?[]:rows}
          rowCount={total}
          loading={isLoading}
          columns={columns}
          pageSize={pageSize}
          sortingMode='server'
          paginationMode='server'
          onSortModelChange={handleSortModel}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={newPage => setPage(newPage)}
          // components={{ Toolbar: ServerSideToolbar }}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          componentsProps={{
            toolbar: {
              value: searchValue,
              clearSearch: () => handleSearch(''),
              onChange: event => handleSearch(event.target.value)
            }
          }}
        />
      </Card>
    </>
  )
}

export default TableServerSide
