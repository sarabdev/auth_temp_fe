// ** React Imports
import { useEffect, useState, useCallback } from 'react'
import { statesData } from 'src/store/states';
// ** Next Import
import Link from 'next/link'
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.bubble.css';
// import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/router';

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
import AddTemplate from './add';
const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]
const TableServerSide = () => {
  // ** State
  const router=useRouter()
  const [isLoading,setIsLoading]=useState(false)
  const [state,setState]=useState({
    nickname:'',
    fullname:'',
    email:'',
    address:'',
    country:'',
    state:'',
    city:'',
    zip:''
    
  })
  const countries=['USA']
  const [value,setValue]=useState('')
  const [template,setTemplate]=useState({
      id:false,
      name:"TEST",
      body:""
  })

  const handleChange=(e)=>{
    setTemplate({
      ...template,
      [e.target.name]:e.target.value
    })
  }
  const [templates,setTemplates]=useState([])
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

 
  const handleClose = () =>{
    setTemplate({
      id:false,
      name:""
    })
    setValue("")
    setOpen(false)}

  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  const fetchTableData = useCallback(
    async (sort, column) => {
      setIsLoading(true)
      await axios.get(`${BASE_URL}/templates`,{headers:{
            Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
          }})
        .then(res => {
          setTotal(res.data.length)
          setRows(loadServerRows(page, res.data))
          setIsLoading(false)
          setTemplates(res.data)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  )
  useEffect(() => {
    fetchTableData(sort, sortColumn)
  }, [fetchTableData, sort, sortColumn])

  const handleSelected=(id)=>{
     let selectedTemplate=templates.filter((template)=>template.id==id)
     console.log(selectedTemplate)
     setTemplate({
      id:selectedTemplate[0].id,
      name:selectedTemplate[0].name,
     })
     setValue(selectedTemplate[0].body)
  }
 
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
      headerName: 'ID',
      field: 'id',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Subject',
      field: 'name',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.name}
        </Typography>
      )

    },
    {
      flex:0.2,
      minWidth:140,
      headerName:'Action',
      field:'action',
      renderCell:params=>(
        <Button variant='contained' onClick={()=>{handleSelected(params.row.id);setOpen(true)}}>Update</Button>
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

  // const handleChange=(e)=>{
  //   setState({
  //     ...state,
  //     [e.target.name]:e.target.value
  //   })
  // }

  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }

  const updateTemplate=async()=>{
   try{
    await axios.put(`${BASE_URL}/templates/${template.id}`,{name:template.name,body:value},{headers:{
      Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
    }})

    setTemplate({
      name:"",
      body:""
    })
    setValue('')
    toast.success('Template updated successfully.', {
      duration: 2000
    })
    fetchTableData()
  }
  catch(e){
    
  }
  }

  const addTemplate=async()=>{
    try{
      console.log(value)
      await axios.post(`${BASE_URL}/templates`,{name:template.name,body:value})
      setTemplate({
        name:"",
        body:""
      })
      setValue('')
      toast.success('Template added successfully.', {
        duration: 2000
      })
      fetchTableData()
     
    }
    catch(e){

    }
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    handleClose()
    if(template.id){
      updateTemplate()
    }
    else{
      addTemplate()
    }
  }

  return (
    <>
      <Dialog
        open={open}
        maxWidth={'md'}
       disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>{template.id?'Update':"Add"} Template</DialogTitle>
        <Card style={{height:"600px"}}>
        <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Grid container >
             
            <form onSubmit={handleSubmit}>
            <FormControl sx={{ mt: 1,width:700 }} style={{display:"flex",flexDirection:"row", justifyContent:'space-between'}}>
              <TextField required defaultValue={template.name} value={template.name} style={{width:'70%'}}  name="name" onChange={handleChange} id="outlined-basic" label="Name" variant="outlined" />
              <div style={{display:"flex", justifyContent:"space-between"}}>
              <Button type="submit" variant='contained' style={{marginRight:"10px"}}>{template.id?'Update':'Add'}</Button>
                <Button onClick={handleClose}>Discard</Button>
              </div>
            </FormControl>
           
            <FormControl sx={{mt: 6}}>
            <ReactQuill required style={{width:"800px",height:"400px"}}  theme="snow" modules={modules} formats={formats} value={value} onChange={setValue} />
              {/* <TextField value={template.body} fullWidth multiline name="body" onChange={handleChange} minRows={15}  id="outlined-basic" label="Body" variant="outlined" /> */}
            
            </FormControl>
            </form>
          
           

                </Grid>
              </Grid>
            </Grid>
          </CardContent>

     </Card>   
      </Dialog>
      <Card>
        <CardHeader title='Templates' 
        action={
            <Box>
              <Button size='small' variant='contained' onClick={()=>setOpen(true)}>
                Add Template
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
