// ** React Imports
import { useEffect, useState, useCallback } from 'react'
import { statesData } from 'src/store/states';
// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import TextareaBasic from 'src/views/forms/form-elements/textarea/TextareaBasic';
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
   id:false,
   name:"",
   heading:"",
   description:""
    
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
  const [interestingItems, setInterestingItems]= useState([])
  const [isUpdate,setIsUpdate]=useState(false)

  const handleClose = () =>{ setOpen(false)
    setIsUpdate(false)
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
      await axios.get(BASE_URL+"/interesting-item",{headers:{
            Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
          }})
        .then(res => {
          setTotal(res.data.length)
          setRows(loadServerRows(page, res.data))
          setInterestingItems(res.data)
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



  const handleSelected=(id)=>{
    let selectedItem=interestingItems.filter((item)=>item.id===id)
    
    setState({
     id,
     name:selectedItem[0].name,
     heading:selectedItem[0].heading,
     description:selectedItem[0].description,
   })
   }
 



  const handleDelete=async(id,platform)=>{
    try{
    let response=await axios.delete(BASE_URL+"/interesting-item/"+id,{headers:{
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
    // fetchCities()
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
      headerName: 'Name',
      field: 'name',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.name}
        </Typography>
      )

    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Heading',
      field: 'heading',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.heading}
        </Typography>
      )

    },
    {
      flex: 0.2,
      minWidth: 240,
      headerName: 'Description',
      field: 'description',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.description}
        </Typography>
      )

    },
    {
      flex: 0.2,
      minWidth: 40,
      headerName: 'View',
      field: 'view',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            <Box>
              {row.result !== 'Not Valid' && ( // add this line to conditionally render the IconButton
                <IconButton
                  size='small'
                  onClick={() =>{ setOpen(true);handleSelected(row.id);setIsUpdate(true)}}
                  sx={{ textDecoration: 'none' }}
                >
                  <EyeOutline fontSize='small' />
                </IconButton>
              )}
            </Box>
          </Tooltip>
        </Box>
      )
    },
    {
      flex:0.2,
      minWidth:40,
      headerName:'Action',
      field:'action',
      renderCell:params=>(
        <Button variant='contained' onClick={()=>handleDelete(params.row.id)} >Delete</Button>
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

  const handleUpdate=async(e)=>{
    e.preventDefault()
    handleClose()
    
    try{
      let response=await axios.put(BASE_URL+"/interesting-item/"+state.id,{
        name:state.name,
        heading: state.heading,
        description: state.description
      },{headers:{
          Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
        }})

        toast.success("Updated Successfully!", {
          duration: 2000})
      
         fetchTableData()
        
      }
      catch(error){
        toast.error("Something went wrong.", {
          duration: 2000
        })
      }
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    handleClose()
  
    try{
      let response=await axios.post(BASE_URL+"/interesting-item",{
        name:state.name,
        heading: state.heading,
        description: state.description
      },{headers:{
          Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
        }})

  
      if(!response?.data?.error){ 
        toast.success("Added Successfully!", {
          duration: 2000
        })
         fetchTableData()
      }
      else
      toast.error("Something went wrong.", {
        duration: 2000
      })
      }
      catch(error){
        toast.error("Something went wrong.", {
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
        <DialogTitle id='alert-dialog-title'>{isUpdate?'Update Interesting Item':'Add Interesting item'}</DialogTitle>
        <form onSubmit={isUpdate?handleUpdate:handleSubmit} >

        <FormControl sx={{padding:5, width:550, mb:4}}>
              <TextField  required type='text' value={state.name} onChange={handleChange} id="standard-basic" name="name" label="Name" placeholder='Enter name...' variant="standard" />
            </FormControl>

            <FormControl sx={{padding:5, width:550, mb:4}}>
              <TextField  required type='text' value={state.heading}  onChange={handleChange} id="standard-basic" name="heading" label="Heading" placeholder='Enter heading of joke/recipe...' variant="standard" />
            </FormControl>

            <FormControl sx={{padding:5, width:550, mb:4}}>
                  <TextField minRows={4} required value={state.description} onChange={handleChange} name="description" type='text' multiline id='textarea-outlined' placeholder='Enter description for joke/recipe...' label='Description' />
            </FormControl>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Discard</Button>
          {!isUpdate ? <Button type='submit'  variant='contained'>{'Create'}</Button>:<Button type="submit" variant='contained'>Update</Button>}

        </DialogActions>
        </form>    
      </Dialog>
      <Card>
        <CardHeader title='Interesting Items' 
        action={
            <Box>
              <Button size='small' variant='contained' onClick={()=>setOpen(true)}>
                Add Interesting Item
              </Button>
            </Box>
          }
        />
        <DataGrid
          autoHeight
          pagination
          rows={rows}
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
