// ** React Imports
import { useEffect, useState, useCallback } from 'react'
import { statesData } from 'src/store/states'
import Divider from '@mui/material/Divider'

import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { FormLabel } from '@mui/material'
import { FormGroup } from '@mui/material'
import { FormHelperText } from '@mui/material'
import EditIcon from 'mdi-material-ui/LeadPencil'
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
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
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
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import TimeField from 'react-simple-timefield'

import { styled } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import moment from 'moment/moment'

// ** ThirdParty Components
import axios from 'axios'

import toast from 'react-hot-toast'
import { countriesData } from 'src/store/countries'

const Batches = () => {
  // ** State
  const initialState = {
    name: '',
    address: '',
    selectedApplications: []
  }

  const [companyDetails, setCompanyDetails] = useState(initialState)
  const handleChange = event => {
    const { name, value, type, checked } = event.target

    if (type === 'checkbox') {
      const appId = applicationIDs[name] // Get the corresponding application ID
      setCompanyDetails(prevState => ({
        ...prevState,
        selectedApplications: checked
          ? [...prevState.selectedApplications, appId] // Add app ID if checked
          : prevState.selectedApplications.filter(id => id !== appId) // Remove app ID if unchecked
      }))
    } else {
      // For text fields, simply update the value
      setCompanyDetails(prevState => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  const handleEdit = row => {
    // Populate the dialog with the details of the selected row
    setCompanyDetails({
      name: row.name,
      address: row.address,
      selectedApplications: row.applications.map(appId => appId.id)
    })
    setIsUpdate(true) // Set the mode to update
    setOpen(true) // Open the dialog
  }

  const onSubmit = event => {
    event.preventDefault()
    if (isUpdate) {
      handleUpdate(companyDetails)
    } else {
      handleSubmit(companyDetails)
    }
  }

  const [isUpdate, setIsUpdate] = useState(false)
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
  const handleClose = () => {
    setOpen(false)
    setIsUpdate(false)
    setCompanyDetails(initialState)
  }

  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  const fetchTableData = useCallback(
    async (sort, column) => {
      await axios
        .get(BASE_URL + '/companies/findAll', {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
          }
        })
        .then(res => {
          setTotal(res.data.length)
          const recordsWithSerial = res.data.map((record, index) => {
            return { ...record, serial: index + 1 }
          })
          setRows(loadServerRows(page, recordsWithSerial))
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  )
  useEffect(() => {
    fetchTableData(sort, sortColumn)
  }, [fetchTableData, sort, sortColumn])

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
      minWidth: 170,
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
      flex: 0.05,
      minWidth: 80,
      headerName: 'Edit',
      field: 'edit',
      renderCell: params => (
        <IconButton onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </IconButton>
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

  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }

  const applicationIDs = {
    ems: 1,
    samodrei: 2,
    ascthem: 3,
    pharmacy_portal: 4
  }

  const handleSubmit = async details => {
    try {
      await axios.post(BASE_URL + '/companies', {
        name: details.name,
        address: details.address,
        applicationIds: details.selectedApplications
      })

      toast.success('Company  added successfully.', {
        duration: 2000
      })
      handleClose()
      fetchTableData()
    } catch (e) {}
  }

  const handleUpdate = async details => {
    console.log(details)
    try {
      await axios.put(BASE_URL + '/companies', {
        id: details.id,
        name: details.name,
        address: details.address,
        applicationIds: details.selectedApplications
      })

      toast.success('Company  added successfully.', {
        duration: 2000
      })
      handleClose()
      fetchTableData()
    } catch (e) {}
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
        <form onSubmit={onSubmit}>
          <DialogTitle id='alert-dialog-title'>{isUpdate ? 'Update Company' : 'Create New Company'}</DialogTitle>
          <DialogContent>
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <Grid container>
                    <FormControl sx={{ width: 400, mb: 6 }}>
                      <TextField
                        required
                        type='text'
                        value={companyDetails.name}
                        onChange={handleChange}
                        name='name'
                        label='Name'
                        placeholder='Enter company name'
                        variant='standard'
                      />
                    </FormControl>
                    <FormControl sx={{ width: 400, mb: 6 }}>
                      <TextField
                        required
                        type='text'
                        value={companyDetails.address}
                        onChange={handleChange}
                        name='address'
                        label='Address'
                        placeholder='Enter company address'
                        variant='standard'
                      />
                    </FormControl>
                    <Typography variant='subtitle1' sx={{ width: '100%', marginBottom: 2, marginTop: 2 }}>
                      Assign Applications:
                    </Typography>
                    <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={companyDetails.selectedApplications.includes(applicationIDs['ems'])}
                              onChange={handleChange}
                              name='ems'
                            />
                          }
                          label='EMS'
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={companyDetails.selectedApplications.includes(applicationIDs['samodrei'])}
                              onChange={handleChange}
                              name='samodrei'
                            />
                          }
                          label='Samodrei'
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={companyDetails.selectedApplications.includes(applicationIDs['ascthem'])}
                              onChange={handleChange}
                              name='ascthem'
                            />
                          }
                          label='Ascthem'
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={companyDetails.selectedApplications.includes(applicationIDs['pharmacy_portal'])}
                              onChange={handleChange}
                              name='pharmacy_portal'
                            />
                          }
                          label='Pharmacy Portal'
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button type='submit' variant='contained'>
              {isUpdate ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Card>
        <CardHeader
          title='Companies'
          action={
            <Box>
              <Button
                size='small'
                variant='contained'
                onClick={() => {
                  handleClickOpen()
                  setIsUpdate(false)
                }}
              >
                Create new company
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

export default Batches
