// ** React Imports
import { useEffect, useState, useCallback } from 'react'
import { statesData } from 'src/store/states'
import Divider from '@mui/material/Divider';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import TimeField from 'react-simple-timefield';


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
import { countriesData } from 'src/store/countries';


const Batches = () => {
  // ** State
  const [timeSeconds,setTimeSeconds]=useState("12:34:56")
  const marketingAdOptions=["Ad 1","Ad 2","Ad 3"]
  const repeat=["Daily","Weekly","Monthly"]
  const [state,setState]=useState({
    id:false,
    filter:"",
    name:"",
    city:'',
    state:'',
    specialization:[],
    target_school:'',
    country:'',
    origin_school:'',
    marketing_ad:'',
    repeat:'',
    time:'12:00',
    news:false,
    school:'',
    endpoint:'',
    senderEmail:'',
    subject:'',
    emailSubject:''
  })
  const [filters,setFilters]=useState([])
  const [filteredFilters,setFilteredFilters]=useState([])
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
  const [countries,setCountries]=useState([...countriesData])
  const [filteredCountries,setFilteredCountries]=useState([...countriesData.slice(0,20)])
  const platforms=[{label:"Sendgrid",value:"sendgrid"},{label:"Salesforce", value:"salesforce"}]

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
        .get(BASE_URL+"/filters", {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  )
  useEffect(() => {
    fetchTableData(sort, sortColumn)
  }, [fetchTableData, sort, sortColumn])


  const onTimeChange=(event, value)=> {
    const newTime = value.replace(/-/g, ':');
    const time = newTime.substr(0, 5);
    const timeSeconds2 = newTime.padEnd(8, timeSeconds.substr(5, 3));
    const timeSecondsCustomColon = timeSeconds2.replace(/:/g, '-');

    setTimeSeconds(timeSeconds2)
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

  // const fetchSchools=async()=>{
  //   try{
  //   const response=await axios.get(`${BASE_URL}/schools`);
  //   setSchools(response.data)
  //   setFilteredSchools(response.data.slice(0,20))
  //   }
  //   catch(e){
  //     fetchSchools()
  //   }
    
  // }

  const fetchSenders=async()=>{
    try{
      const response=await axios.get(BASE_URL+"/sender",{
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

     const fetchStates=async()=>{
      try{
        setStates(statesData)
        setFilteredStates(statesData.slice(0,20))
        }
        catch(e){
          fetchStates()
        }
       } 

         const fetchSpecializations=async()=>{
          try{
            const response=await axios.get(BASE_URL+"/specialization",{
              headers: {
                Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
              }
            });
            setSpecializations(response.data)
            setFilteredSpecializations(response.data)
            }
            catch(e){
              fetchSpecializations()
            }
           } 


           const fetchFilters=async()=>{
            try{
              const response=await axios.get(BASE_URL+"/filters",{
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

             const fetchTemplates=async()=>{
              try{
                const response=await axios.get(BASE_URL+"/templates",{
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
            const abortController = new AbortController();
          
            const fetchData = async () => {
              try {
                await fetchCities();
                await fetchStates();
                await fetchFilters();
                await fetchSpecializations();
                await fetchSenders()
                await fetchTemplates()
                // await fetchSchools();
              } catch (error) {
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

 const handleDelete=async(id)=>{
  try{
    let response= await axios.delete(BASE_URL+"/filters/"+id,{headers:{
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

  const handleSelected=(id)=>{
   let selectedBatch=batchesList.filter((batch)=>batch.id===id)
   setState({
    id,
    name:selectedBatch[0].name,
    // filter:selectedBatch[0].filter,
  city:selectedBatch[0].cities.split(',').map((value)=>value)
  ,
  state:selectedBatch[0].states.split(',').map((value)=>value),
  specialization:selectedBatch[0].specializations.split(',').map((value)=>value),
  country:selectedBatch[0].country,
  marketing_ad:selectedBatch[0].marketing_ad,
  repeat:selectedBatch[0].repeat,
  news:selectedBatch[0].news,
  endpoint:selectedBatch[0].endpoint,
  senderEmail:selectedBatch[0].senderEmail,
  subject:selectedBatch[0].subject,
  time:selectedBatch[0].time,
  emailSubject:selectedBatch[0].emailSubject
  })
  }

  

  const columns = [
    {
      flex: 0.2,
      minWidth: 140,
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
      minWidth: 140,
      headerName: 'Name',
      field: 'name',
      renderCell: params => (
        <Tooltip title={params.row.name}>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.name}
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
      headerName: 'Action',
      field: 'action',
      renderCell: params => (
        <Button size="small" variant='contained' onClick={()=>handleDelete(params.row.id)} >Delete</Button>

      )
    },
    // {
    //   flex:0.2,
    //   minWidth:140,
    //   headerName:'Action',
    //   field:'action',
    //   renderCell:params=>(
    //     <Button  variant='contained' onClick={()=>{handleDelete(params.row.id)}}>Delete</Button>
        
    //     )
    // }
  
    
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
      name:"",
    city:[],
    state:[],
    specialization:[],
    country:'',
    emailSubject:''
    })
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    const localTime = moment(state.time, 'HH:mm');
    const utcTime = localTime.utc();
    const utcTimeString = utcTime.format('HH:mm');
    if(!state.news && state.subject.length<1){
      toast.error("Please select template", {
        duration: 2000
      })
      return
    }
    handleClose()
    try{
      const res=await axios.post(BASE_URL+"/filters",{
       name:state.name,
       cities:state.city,
       states:state.state,
       specializations:state.specialization,
       country:state.country,
       marketing_ad:state.marketing_ad,
       repeat:state.repeat,
       news:state.news,
       endpoint:state.endpoint,
       senderEmail:state.senderEmail,
       subject:state.subject,
       time:utcTimeString,
       emailSubject:state.emailSubject
     },{headers:{
        Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
      }})
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
    if(!state.news && state.subject.length<1){
      toast.error("Please select template", {
        duration: 2000
      })
      return
    }
    handleClose()

    try{
      await axios.put(BASE_URL+"/filters/"+state.id,
      {
        name:state.name,
        cities:state.city,
        states:state.state,
        specializations:state.specialization,
        country:state.country,
        marketing_ad:state.marketing_ad,
        repeat:state.repeat,
        news:state.news,
        endpoint:state.endpoint,
        senderEmail:state.senderEmail,
        subject:state.subject,
        time:state.time, 
        emailSubject:state.emailSubject
      },
      
      {headers:{
        Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
      }})
      fetchTableData()
      toast.success('Filter updated successfully.', {
        duration: 2000
      })
      
      }
      catch(e){
        toast.error("Something went wrong.", {
          duration: 2000
        })
      }
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
    setSenders(filteredOptions)
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


  const handleMultiState=(value,key)=>{
    setState({
      ...state,
    [key]:value
    })
  }

  const renderTags = (value, getTagProps) =>
  value.map((option, index) => (
    <Chip
      key={index}
      label={option}
      {...getTagProps({ index })}
      style={{ margin: '1px' }} // Customize the margin here
    />
  ));

  const handleSearchCity=(event)=>{
    const searchText = event.target.value;
    setState({...state,city:searchText})
    const filteredOptions = cities.filter((option) =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );
    const limitedOptions = filteredOptions.slice(0, 20);
    setFilteredCities(limitedOptions);
  }

  const handleSearchTextChange = (event) => {
    const searchText = event.target.value;
    setState({...state,country:searchText})

    const filteredOptions = countries.filter((option) =>
      option.toLowerCase().includes(searchText.toLowerCase())
    );
    const limitedOptions = filteredOptions.slice(0, 20);
    setFilteredCountries(limitedOptions);
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

  function getFilteredSenders() {
    if (state.endpoint === 'Sendgrid') {
      return filteredSenders
        .filter((item) => item.platform === 'sendgrid')
        .map((item) => ({ value: item.email, label: item.email }));
    } else if (state.endpoint === 'Salesforce') {
      return filteredSenders
        .filter((item) => item.platform === 'salesforce')
        .map((item) => ({ value: item.email, label: item.email }));
    } else {
      return filteredSenders.map((item) => ({ value: item.email, label: item.email }));
    }
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
        <DialogTitle id='alert-dialog-title'>{isUpdate?'Update Filter':'Create New Filter'}</DialogTitle>
        <DialogContent>
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Grid container >
                <FormControl sx={{ width:400, mb:6}}>
              <TextField  required type='text' value={state.name} onChange={handleChange} id="standard-basic" name="name" label="Name" placeholder='Enter filter name' variant="standard" />
            </FormControl>
            <br/>
            <Typography variant='subtitle1' sx={{width:"100%",marginBottom:2}}>
          Target Filters:
        </Typography>
            <FormControl sx={{width:200 }}>
            <Autocomplete
                multiple
                 defaultValue={isUpdate?state.city.filter(item => item !== ""):[]}
                 onChange={(e,values)=>handleMultiState(values,'city')}
                 options={filteredCities?.map(item => item.name)}  
                 getOptionLabel={(option) => option}
                 renderTags={renderTags}
                 clearIcon={null}
                 renderInput={(params) => (
                     <TextField
                     
                         {...params}
                         onChange={handleSearchCity}
                         label="Target City"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>

            <FormControl sx={{ ml:15,width:200 }}>
            <Autocomplete
            multiple
                
                defaultValue={isUpdate?state.state.filter(item => item !== ""):[]}
                id="tags-standard"
                //  value={state.state}
                 onChange={(e,values)=>handleMultiState(values,"state")}
                 //onChange={(e,value)=>handleOptionChange(e,value,'state')}
                 options={filteredStates?.map(item=>item.abbreviation)}  
                  getOptionLabel={(option) => option}
                  renderTags={renderTags}
                  clearIcon={null}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchState}
                         label="Target State"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
            <Divider/>
            <FormControl sx={{ mt: 6,width:200 }}>
            {/* <Autocomplete
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
               /> */}
                <Autocomplete
                multiple
                 defaultValue={isUpdate?state.specialization.filter(item => item !== ""):[]}
                 onChange={(e,values)=>handleMultiState(values,'specialization')}
                 options={filteredSpecialization?.map(item =>item.specialization) || []}  
                 getOptionLabel={(option) => option || ''}
                 clearIcon={null}
                 isOptionEqualToValue={(option, value) => option === value} // Customize the equality test if needed

                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchSpecialization}
                         label="Target Specialization"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
           
          
            <FormControl sx={{ml:15,mt: 6,width:200 }}>
            <Autocomplete
                //  defaultValue={state.city}
                 disabled
                 onChange={(e,value)=>handleOptionChange(e,value,'target_school')}
                 options={filteredSchools?.map(item =>({value: item.school, label: item.school}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchSchool}
                         label="Target School"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>

          

            <Typography variant='subtitle1' sx={{width:"100%",marginBottom:2, marginTop:5}}>
          Origin Filters:
        </Typography>

        <FormControl sx={{width:200 }}>
            <Autocomplete
                 defaultValue={isUpdate?state.country:""}
                 onChange={(e,values)=>handleMultiState(values,'country')}
                 options={filteredCountries?.map(item => item)}  
                 getOptionLabel={(option) => option}
                 renderTags={renderTags}
                 clearIcon={null}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchTextChange}
                         label="Origin Country"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>


            <FormControl sx={{ ml:15,width:200 }}>
            <Autocomplete
            multiple
                
                
                defaultValue={[]}
                id="tags-standard"
                disabled
                //  value={state.state}
                 onChange={(e,values)=>handleMultiState(values,"origin_school")}
                 //onChange={(e,value)=>handleOptionChange(e,value,'state')}
                 options={filteredStates?.map(item=>item.abbreviation)}  
                  getOptionLabel={(option) => option}
                  renderTags={renderTags}
                  clearIcon={null}
                 renderInput={(params) => (
                     <TextField
                     
                         {...params}
                         onChange={handleSearchState}
                         label="Origin School"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
            <Typography variant='subtitle1' sx={{width:"100%",marginBottom:2, marginTop:5}}>
          Configuration:
        </Typography>

        <FormControl sx={{width:200 }}>
            <Autocomplete

                 defaultValue={isUpdate?state.marketing_ad:''}
                 onChange={(e,values)=>handleMultiState(values,'marketing_ad')}
                 options={marketingAdOptions?.map(item => item)}  
                 getOptionLabel={(option) => option}
                 renderTags={renderTags}
                 clearIcon={null}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                        //  onChange={handleSearchTextChange}
                         label="Marketing Ad"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>


            <FormControl sx={{ ml:15,width:200 }}>
            <Autocomplete
            
                
                defaultValue={isUpdate?state.repeat:''}
                id="tags-standard"
                //  value={state.state}
                 onChange={(e,values)=>handleMultiState(values,"repeat")}
                 //onChange={(e,value)=>handleOptionChange(e,value,'state')}
                 options={repeat?.map(item=>item)}  
                  getOptionLabel={(option) => option}
                  renderTags={renderTags}
                  clearIcon={null}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         required
                         onChange={handleSearchState}
                         label="Repeat"
                         variant="outlined"
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>

            <FormControl sx={{ width:400, mb:2, mt:4, ml:2}}>
              <TextField  required type='text' value={state.emailSubject} onChange={handleChange} id="standard-basic" name="emailSubject" label="Email subject" placeholder='Enter email subject' variant="standard" />
            </FormControl>
            <FormControl sx={{width:200, mt:6}}>
            
      {/* <label>Select time:</label> */}
      <TextField style={{ color: 'gray' }} onChange={(e)=>setState({...state, time:e.target.value})} defaultValue={state.time}  type="time" label='Select time'/>            
            </FormControl>

            <FormControl sx={{ml:15,width:200, mt:8}}>
            <FormControlLabel  control={<Checkbox onChange={(e)=>setState({...state, news:e.target.checked})} defaultChecked={state.news} />} label="Attach News" />

            </FormControl>
            <FormControl sx={{ width:200, mt:6 }}>
            <Autocomplete
                //  defaultValue={state.city}
                defaultValue={isUpdate?{label:state.endpoint, value:state.endpoint}:null}
                onChange={(e,value)=>handleOptionChange(e,value,'endpoint')}
                 options={platforms?.map(item =>({value: item.value, label: item.label}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                        //  onChange={handleSearchSender}
                         label="Select an endpoint"
                         variant="outlined"
                         required
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
            <FormControl sx={{ width:200, mt:6, ml:15 }}>
            <Autocomplete
                 defaultValue={isUpdate?{label:state.senderEmail, value:state.senderEmail}:null}
                //  value={{label:state.senderEmail,value:state.senderEmail}}
                 onChange={(e,value)=>handleOptionChange(e,value,'senderEmail')}
                 options={getFilteredSenders()}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchSender}
                         label="Select a sender"
                         variant="outlined"
                         required
                         inputProps={{
                             ...params.inputProps,
                        }}
                     />
                  )}
               />
            </FormControl>
            <FormControl sx={{ mt: 6,width:200 }}>
            <Autocomplete
                disabled={state.news}
                 defaultValue={isUpdate?{label:state.subject, value:state.subject}:null}
                 onChange={(e,value)=>handleOptionChange(e,value,'subject')}
                 options={filteredTemplates?.map(item =>({value: item.name, label: item.name}))}  
                 getOptionLabel={(option) => option.label}
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         onChange={handleSearchSubject}
                         
                         label="Select a template"
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
          {!isUpdate ? <Button type='submit'  variant='contained'>{'Create'}</Button>:<Button type="submit" variant='contained'>Update</Button>}

        </DialogActions>
        </form>

      </Dialog>


     
      <Card>
        <CardHeader title='Filters' 
        action={
            <Box>
              <Button size='small' variant='contained' onClick={()=>{handleClickOpen();setIsUpdate(false)}}>
                Create New Filter
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
