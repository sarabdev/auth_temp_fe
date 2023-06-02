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
    endpoint:'',
    senderEmail:'',
    subject:'',
    city:'',
    state:'',
    specialization:'',
    country:'',
    school:''
  })
  const [cities,setCities]=useState([])
  const [filteredCities,setFilteredCities]=useState([])
  const [schools,setSchools]=useState([])
  const [filteredSchools,setFilteredSchools]=useState([])
  const [states,setStates]=useState([])
  const [filteredStates,setFilteredStates]=useState([])
  const [templates,setTemplates]=useState([])
  const [filteredTemplates,setFilteredTemplates]=useState([])
  const [specializations,setSpecializations]=useState([])
  const [filteredSpecialization,setFilteredSpecializations]=useState([])
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
  const [isFormOpen,setIsFormOpen]=useState(false)
  const [productData, setProductData] = useState([])
  const [userDetails, setUserDetails] = useState([])

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
      await axios
        .get(`${BASE_URL}/batch`, {
          headers: {
            Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
            // sort,
            // column
          }
        })
        .then(res => {
          setTotal(res.data.length)
          setRows(loadServerRows(page, res.data))
          setBatchesList(res.data)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  )
  useEffect(() => {
    console.log("fetchTableData")
    fetchTableData(sort, sortColumn)
  }, [fetchTableData, sort, sortColumn])

  const fetchCities=async()=>{
    try{
    const response=await axios.get(`${BASE_URL}/cities`);
    setCities(response.data)
    setFilteredCities(response.data.slice(0,20))
    }
    catch(e){
      fetchCities()
    }
    
  }

  const fetchSchools=async()=>{
    try{
    const response=await axios.get(`${BASE_URL}/schools`);
    setSchools(response.data)
    setFilteredSchools(response.data.slice(0,20))
    }
    catch(e){
      fetchSchools()
    }
    
  }

  const fetchSenders=async()=>{
    try{
      const response=await axios.get(`${BASE_URL}/sender`);
      setSenders(response.data)
      setFilteredSenders(response.data)
      }
      catch(e){
        fetchSenders()
      }
     }

     const fetchStates=async()=>{
      try{
        // const response=await axios.get(`${BASE_URL}/states`);
        // setStates(response.data)
        setStates(statesData)
        setFilteredStates(statesData.slice(0,20))
        }
        catch(e){
          fetchStates()
        }
       } 

       const fetchTemplates=async()=>{
        try{
          const response=await axios.get(`${BASE_URL}/templates`);
          setTemplates(response.data)
          setFilteredTemplates(response.data)
          }
          catch(e){
            fetchTemplates()
          }
         } 

         const fetchSpecializations=async()=>{
          try{
            const response=await axios.get(`${BASE_URL}/specialization`);
            setSpecializations(response.data)
            setFilteredSpecializations(response.data)
            }
            catch(e){
              fetchSpecializations()
            }
           } 

           useEffect(() => {
            const abortController = new AbortController();
          
            const fetchData = async () => {
              try {
                await fetchCities();
                await fetchSenders();
                await fetchStates();
                await fetchTemplates();
                await fetchSpecializations();
                await fetchSchools();
              } catch (error) {
                console.log('Error:', error);
              }
            };
          
            fetchData();
          
            return () => {
              abortController.abort();
            };
          }, []);

  const MUITableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: 0,
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
    paddingTop: `${theme.spacing(1)} !important`,
    paddingBottom: `${theme.spacing(1)} !important`
  }))

  const handleSelected=(id)=>{
   let selectedBatch=batchesList.filter((batch)=>batch.id===id)
   setState({
    id,
  endpoint:selectedBatch[0].endpoint,
  senderEmail:selectedBatch[0].senderEmail,
  subject:selectedBatch[0].subject,
  city:selectedBatch[0].city,
  state:selectedBatch[0].state,
  specialization:selectedBatch[0].specialization,
  country:selectedBatch[0].country,
  school:selectedBatch[0].school
  })
  }

  const columns = [
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'ID',
      field: 'userID',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Status',
      field: 'email',
      renderCell: params => (
        <Tooltip title={params.row.status}>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.status}
          </Typography>
        </Tooltip>
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
      minWidth: 140,
      headerName: 'Record Count',
      field: '',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
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
    senderEmail:'',
    subject:'',
    city:'',
    state:'',
    specialization:'',
    country:'',
    school:''
    })
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    handleClose()

    await axios.post(`${BASE_URL}/batch`,{...state},{headers:{
      Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
    }})
    fetchTableData()
  }

  const handleUpdate=async(e)=>{
    e.preventDefault()
    handleClose()
    await axios.put(`${BASE_URL}/batch/${state.id}`,state,{headers:{
      Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
    }})
    fetchTableData()
  }

  const handleSearchState=(event)=>{
    const searchText = event.target.value;
    setState({...state,state:searchText})
    const filteredOptions = states.filter((option) =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredStates(filteredOptions);
  }

  const handleSearchSender=(event)=>{
    const searchText = event.target.value;
    setState({...state,senderEmail:searchText})
    const filteredOptions = senders.filter((option) =>
      option.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredSenders(filteredOptions);
  }

  const handleSearchSpecialization=(event)=>{
    const searchText = event.target.value;
    setState({...state,specialization:searchText})
    const filteredOptions = specializations.filter((option) =>
      option.specialization.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredSpecializations(filteredOptions);
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

  const handleSearchSchool = (event) => {
    const searchText = event.target.value;
    setState({...state,school:searchText})

    const filteredOptions = schools.filter((option) =>
      option.school.toLowerCase().includes(searchText.toLowerCase())
    );
    const limitedOptions = filteredOptions.slice(0, 20);
    setFilteredSchools(limitedOptions);
  };

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
             
            <FormControl sx={{ width:200,ml:7 }}>
              <InputLabel id='demo-dialog-select-label'>Select Endpoint</InputLabel>
              <Select disabled={isUpdate} required value={state.endpoint} onChange={handleChange} name="endpoint" label='Select Endpoint' labelId='demo-dialog-select-label' id='demo-dialog-select' defaultValue=''>
                <MenuItem value="sendgrid">Sendgrid</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width:200, ml:15 }}>
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
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
            <FormControl sx={{ ml:7 ,mt: 6,width:200 }}>
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
                         label="Select an template"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
            <FormControl sx={{ ml:15 ,mt: 6,width:200 }}>
            <Autocomplete
                disabled={isUpdate}
                //  defaultValue={state.city}
                 value={{label:state.city,value:state.city}}
                 onChange={(e,value)=>handleOptionChange(e,value,'city')}
                 options={filteredCities?.map(item =>({value: item.name, label: item.name}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchTextChange}
                         label="Select an city"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>

            <FormControl sx={{ ml:7 ,mt: 6,width:200 }}>
            <Autocomplete
                disabled={isUpdate}
                //  defaultValue={state.city}
                 value={{label:state.state,value:state.state}}
                 onChange={(e,value)=>handleOptionChange(e,value,'state')}
                 options={filteredStates?.map(item =>({value: item.name, label: item.abbreviation}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchState}
                         label="Select an state"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
            <FormControl sx={{ ml:15 ,mt: 6,width:200 }}>
            <Autocomplete
                 disabled={isUpdate}
                 value={{label:state.specialization,value:state.specialization}}
                 onChange={(e,value)=>handleOptionChange(e,value,'specialization')}
                 options={filteredSpecialization?.map(item =>({value: item.specialization, label: item.specialization}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchSpecialization}
                         label="Specialization"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
           
            <FormControl sx={{ ml:7 ,mt: 6,width:200 }}>
              <InputLabel id='demo-dialog-select-label'>Country</InputLabel>
              <Select disabled={isUpdate}  required  value={state.country} onChange={handleChange} name="country" label='Select Sender Email' labelId='demo-dialog-select-label' id='demo-dialog-select' defaultValue=''>
                <MenuItem value="USA">USA</MenuItem>
               
              </Select>
            </FormControl>
            <FormControl sx={{ ml:15 ,mt: 6,width:200 }}>
            <Autocomplete
                disabled={isUpdate}
                //  defaultValue={state.city}
                 value={{label:state.school,value:state.school}}
                 onChange={(e,value)=>handleOptionChange(e,value,'school')}
                 options={filteredSchools?.map(item =>({value: item.school, label: item.school}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchSchool}
                         label="Select an school"
                         variant="outlined"
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
