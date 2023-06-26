// ** React Imports
import { useEffect, useState, useCallback } from 'react'
import { statesData } from 'src/store/states'
// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import { BASE_URL } from 'src/configs/config'
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
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

import { styled } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import moment from 'moment/moment'

// ** ThirdParty Components
import axios from 'axios'
import  AsyncCreatable from 'react-select/async-creatable';


// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { update } from 'draft-js/lib/DefaultDraftBlockRenderMap'
import { batch } from 'react-redux'
import toast from 'react-hot-toast'

const Batches = () => {
  // ** State
  const [state,setState]=useState({
    id:false,
    name:"",
    endpoint:'',
    senderEmail:'',
    subject:'',
    filter:""

  })
  const platforms=[{label:"Sendgrid",value:"sendgrid"},{label:"Salesforce", value:"salesforce"}]

  const [filters,setFilters]=useState([])
  const [filteredFilters,setFilteredFilters]=useState([])
  const [templates,setTemplates]=useState([])
  const [filteredTemplates,setFilteredTemplates]=useState([])
  const [senders,setSenders]=useState([])
  const [filteredSenders,setFilteredSenders]=useState([])
  const [batchesList,setBatchesList]=useState([])
  const [isUpdate,setIsUpdate]=useState(false)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('userId')
  const [sort, setSort] = useState('asc')
  const [open, setOpen] = useState(false)


  const handleClickOpen = async (barcode, userId) => {
    // await axios.get(`${BASE_URL}product/getproduct/?barcode=${barcode}&userId=${userId}`).then(res => {
    //   if (res?.data) {
    //     setProductData(res.data.product)
    //     setUserDetails(res.data.user)
    //     setOpen(true)
    //   }
    // })
    setOpen(true)
  }
  const handleClose = () =>{ 
    setIsUpdate(false)
    setOpen(false)
    clearState()
}

  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  const fetchTableData = useCallback(
    async (sort, column) => {
      try{
      await axios
        .get(`${BASE_URL}/batch`, {
          headers: {
            Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
          }
        })
        .then(res => {
          setTotal(res.data.length)
          const recordsWithSerial = res.data.map((record, index) => {
            return { ...record, serial: index + 1 };
          });
          setRows(loadServerRows(page, recordsWithSerial))
          setBatchesList(recordsWithSerial)
        })
      }
      catch(e){

      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  )
  useEffect(() => {
    console.log("fetchTableData")
    fetchTableData(sort, sortColumn)
  }, [fetchTableData, sort, sortColumn])

  

  const fetchFilters=async()=>{
    try{
      const response=await axios.get(`${BASE_URL}/filters`,{
        headers: {
          Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
        }
      });
      setFilters(response.data)
      setFilteredFilters(response.data)
      }
      catch(e){
        fetchFilters()
      }
     } 

  const fetchSenders=async()=>{
    try{
      const response=await axios.get(`${BASE_URL}/sender`,{
        headers: {
          Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
        }
      });
      setSenders(response.data)
      setFilteredSenders(response.data)
      }
      catch(e){
        fetchSenders()
      }
     }

     

       const fetchTemplates=async()=>{
        try{
          const response=await axios.get(`${BASE_URL}/templates`,{
            headers: {
              Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
            }
          });
          setTemplates(response.data)
          setFilteredTemplates(response.data)
          }
          catch(e){
            fetchTemplates()
          }
         } 

      

         useEffect(() => {
          
          fetchSenders();
          fetchTemplates();
          fetchFilters()
      
    
    }, []);

  

  const handleSelected=(id)=>{
   let selectedBatch=batchesList.filter((batch)=>batch.id===id)
   setState({
    id,
  endpoint:selectedBatch[0].endpoint,
  senderEmail:selectedBatch[0].senderEmail,
  subject:selectedBatch[0].subject,
  name:selectedBatch[0].name,
  filter:selectedBatch[0].filter,
  subject:selectedBatch[0].template

  })
  }

  const columns = [
    {
      flex: 0.2,
      minWidth: 70,
      headerName: 'S No.',
      field: 'userID',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.serial}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 70,
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
      minWidth: 70,
      headerName: 'Status',
      field: 'status',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.status}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Filters',
      field: 'city',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            <Box>
              {row.result !== 'Not Valid' && ( // add this line to conditionally render the IconButton
                <IconButton
                  size='small'
                  onClick={() =>{ handleClickOpen(row?.productScanned, row?.userId);handleSelected(row.id);setIsUpdate(true)}}
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
      flex: 0.2,
      minWidth: 70,
      headerName: 'Total Count',
      field: 'count',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.count}
        </Typography>
      )
    },
    
    
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

  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }
 
  const handleChange=(e)=>{
    setState({
      ...state,
      [e.target.name]:e.target.value
    })
  }

  const handleOptionChange=(e,value,field)=>{
    setState({
      ...state,
      [field]:value ? value.label :''
    })
  }

  const clearState=()=>{
    setState({
      id:false,
    endpoint:'',
    name:"",
    senderEmail:'',
    subject:'',
    filter:''  
    })
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    handleClose()
    try{
    const res=await axios.post(`${BASE_URL}/batch`,{...state},{headers:{
      Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
    }})
    console.log(res)
    fetchTableData()
    if(res.data.success)
    toast.success('Filter added successfully.', {
      duration: 2000
    })
    else{
      toast.error(res.data.message, {
        duration: 2000
      })
    }
    }
    catch(e){
      toast.error("Something went wrong.", {
        duration: 2000
      })
    }
  }

  const handleUpdate=async(e)=>{
    e.preventDefault()
    handleClose()
    await axios.put(`${BASE_URL}/batch/${state.id}`,state,{headers:{
      Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
    }})
    fetchTableData()
  }


  const handleSearchSender=(event)=>{
    const searchText = event.target.value;
    setState({...state,senderEmail:searchText})
    const filteredOptions = senders.filter((option) =>
      option.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredSenders(filteredOptions);
  }

  const handleSearchSubject = (event) => {
    const searchText = event.target.value;
    setState({...state,subject:searchText})

    const filteredOptions = templates.filter((option) =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );
    const limitedOptions = filteredOptions.slice(0, 20);
    setFilteredTemplates(limitedOptions);
  };

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
           <form onSubmit={isUpdate?handleUpdate:handleSubmit} >
        <DialogTitle id='alert-dialog-title'>{isUpdate?'View Batch':'Create New Batch'}</DialogTitle>
        <DialogContent>
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Grid container >
            <FormControl sx={{ width:400}}>
              <TextField disabled={isUpdate} required type='text' value={state.name} onChange={handleChange} id="standard-basic" name="name" label="Batch name" placeholder='Enter batch name' variant="standard" />
            </FormControl>
            <FormControl sx={{ width:400, mt:6 }}>
            <Autocomplete
                //  defaultValue={state.city}
                disabled={isUpdate}
                 value={{label:state.endpoint,value:state.endpoint}}
                 onChange={(e,value)=>handleOptionChange(e,value,'endpoint')}
                 options={platforms?.map(item =>({value: item.value, label: item.label}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                        //  onChange={handleSearchSender}
                         label="Select an endpoint"
                         variant="standard"
                         required
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
            <FormControl sx={{ width:400, mt:6 }}>
            <Autocomplete
                //  defaultValue={state.city}
                disabled={isUpdate}
                 value={{label:state.senderEmail,value:state.senderEmail}}
                 onChange={(e,value)=>handleOptionChange(e,value,'senderEmail')}
                 options={filteredSenders?.map(item =>({value: item.email, label: item.email}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchSender}
                         label="Select an sender"
                         variant="standard"
                         required
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
            <FormControl sx={{ mt: 6,width:400 }}>
            <Autocomplete
            disabled={isUpdate}
                 value={{label:state.subject,value:state.subject}}
                 onChange={(e,value)=>handleOptionChange(e,value,'subject')}
                 options={filteredTemplates?.map(item =>({value: item.name, label: item.name}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchSubject}
                         required
                         label="Select an template"
                         variant="standard"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
            <FormControl sx={{ mt: 6,width:400 }}>
            <Autocomplete
            disabled={isUpdate}
                 value={{label:state.filter,value:state.filter}}
                 onChange={(e,value)=>handleOptionChange(e,value,'filter')}
                 options={filteredFilters?.map(item =>({value: item.name, label: item.name}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                        //  onChange={handleSearchSubject}
                         required
                         label="Select a filter"
                         variant="standard"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>

                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </DialogContent>

       
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Close</Button>
          {!isUpdate && <Button type='submit'  variant='contained'>{'Create'}</Button>}

        </DialogActions>
        </form>

      </Dialog>


     
      <Card>
        <CardHeader title='Batches' 
        action={
            <Box>
              <Button size='small' variant='contained' onClick={()=>{handleClickOpen();setIsUpdate(false)}}>
                Create New Batch
              </Button>
            </Box>
          }
        />
        <DataGrid
          autoHeight
          pagination
          rows={rows}
          rowCount={total}
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

export default Batches;
