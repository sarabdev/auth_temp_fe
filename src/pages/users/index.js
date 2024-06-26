// ** React Imports
import { useEffect, useState, useCallback, useContext } from 'react'

// ** Next Import
import Link from 'next/link'
import { ListItem, colors } from '@mui/material'
import { ListItemText } from '@mui/material'
// ** MUI Imports
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { List } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
import Tooltip from '@mui/material/Tooltip'
import EditIcon from 'mdi-material-ui/LeadPencil'
import IconButton from '@mui/material/IconButton'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'

// ** ThirdParty Components
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from 'src/context/AuthContext'

const TableServerSide = () => {
  // ** State
  const userData = JSON.parse(window.localStorage.getItem('userData'))
  const { user } = useContext(AuthContext)
  const [state, setState] = useState({
    companies: [],
    username: '',
    password: '',
    email: '',
    assignments: [],
    selectedCompany: ''
  })

  const applicationsData2 = [
    { id: 1, name: 'Auth Dashboard', roles: [{ name: 'Auth_Admin', id: 2 }] },
    { id: 2, name: 'EMS', roles: [{ name: 'Admin', id: 3 }] },
    {
      id: 3,
      name: 'Samodrei',
      roles: [
        { name: 'Admin', id: 3 },
        { name: 'Tele_Marketer', id: 5 },
        { name: 'Tele_Marketer_Manager', id: 6 }
      ]
    },

    {
      id: 4,
      name: 'Ascthem',
      roles: [
        { name: 'Admin', id: 3 },
        { name: 'Manufacturer', id: 7 }
      ]
    },
    {
      id: 5,
      name: 'Pharmacy Portal',
      roles: [
        { name: 'Admin', id: 3 },
        { name: 'Support', id: 10 },
        { name: 'Pharmacy', id: 11 },
        { name: 'Distributor', id: 12 }
      ]
    }
  ]
  const [applicationsData, setApplicationsData] = useState(applicationsData2)
  const [selectedApp, setSelectedApp] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [assignments, setAssignments] = useState([])
  const [isUpdate, setIsUpdate] = useState(false)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('userId')
  const [sort, setSort] = useState('asc')
  const [open, setOpen] = useState(false)

  const handleEdit = row => {
    // Populate the dialog with the details of the selected row

    setState({
      ...state,
      username: row?.userName,
      id: row?.id,
      password: row?.password,
      email: row?.email,
      assignments: row?.access?.map(acs => {
        return {
          appId: acs.application?.id,
          app: acs.application?.name,
          role: acs?.role?.name
        }
      }),
      selectedCompany: row?.company?.id
    })
    setIsUpdate(true) // Set the mode to update
    setOpen(true) // Open the dialog
  }

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
    setState({
      ...state,
      username: '',
      password: '',
      email: '',
      assignments: [],
      selectedCompany: ''
    })
    setOpen(false)
    setIsUpdate(false)
  }

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(BASE_URL + '/companies/findAll', {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
        }
      })

      if (userData.role == 'Auth_Admin') {
        let myCompany = response?.data?.filter(company => company.id == userData.companyId)
        setState({ ...state, companies: myCompany })
        const commonElements = applicationsData2.filter(item1 =>
          user.access.some(item2 => item2.application.id === item1.id)
        )
        setApplicationsData(commonElements)
      } else setState({ ...state, companies: response.data })
    } catch (e) { }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  const handleUpdate = async e => {
    e.preventDefault()
    console.log(state)
    try {
      const result = transformData(state.assignments);
      console.log(result)
      // Assuming you have the user ID stored in state.userId
      const userId = state.id;

      await axios.patch(
        BASE_URL + `/users/EditUserBySuperAdmin/${userId}`,
        {
          email: state.email,
          userName: state.username,
          password: state.password,
          access: state.assignments,
          selectedCompany: state.selectedCompany
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
          }
        }
      );
      toast.success('User updated successfully.', {
        duration: 2000
      })
      handleClose()
      fetchTableData()
    }
    catch (e) {

    }
  }
  const handleSubmit = async e => {
    e.preventDefault()
    console.log(state)

    try {
      const result = transformData(state.assignments)
      if (user?.role == 'Super_Admin')
        await axios.post(
          BASE_URL + `/users/CreateUserBySuperAdmin/${state.selectedCompany}`,
          {
            email: state.email,
            userName: state.username,
            password: state.password,
            access: result.access
          },
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
            }
          }
        )
      else
        await axios.post(
          BASE_URL + `/users/CreateUserByAdmin?${state.selectedCompany}`,
          {
            email: state.email,
            userName: state.username,
            password: state.password,
            access: result.access
          },
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
            }
          }
        )

      toast.success('User added successfully.', {
        duration: 2000
      })
      handleClose()
      fetchTableData()
    } catch (e) { }
  }

  const fetchTableData = useCallback(
    async (sort, column) => {
      if (userData?.role == 'Super_Admin')
        await axios
          .get(BASE_URL + '/users', {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
            }
          })
          .then(res => {
            setTotal(res.data.length)
            console.log(res.data)
            const recordsWithSerial = res.data.filter(d => d.userName.length > 0).map((record, index) => {
              return { ...record, serial: index + 1 }
            })
            setRows(loadServerRows(page, recordsWithSerial))
          })
      else {
        await axios
          .get(BASE_URL + '/users/findAllUserByAuth_Admin', {
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
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  )
  useEffect(() => {
    fetchTableData(sort, sortColumn)
  }, [fetchTableData, sort, sortColumn])


  const handleDelete = async (id) => {
    try {
      let response = await axios.post(`${BASE_URL}/users/delete_user/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
        }
      });
      if (!response?.data?.error) {
        console.log(response.data)
        toast.success("User deleted successfully.", {
          duration: 2000
        });
        fetchTableData(); // Ensure this function updates the table data appropriately
      } else {
        toast.error(response?.data?.message, {
          duration: 2000
        });
      }
    } catch (e) {
      toast.error("Try again!", {
        duration: 2000
      });
    }
  }
  const handleAddAssignment = () => {
    if (selectedApp && selectedRole) {
      // Check for existing assignment of the same application
      console.log(selectedApp)
      console.log(state.assignments)
      const isAlreadyAssigned = state.assignments.some(
        assign => assign.appId === selectedApp && assign.role === selectedRole
      )
      if (!isAlreadyAssigned) {
        const appDetails = applicationsData.find(app => app.id === selectedApp)
        const newAssignment = {
          appId: appDetails.id,
          app: appDetails.name,
          role: selectedRole
        }
        setState({ ...state, assignments: [...state.assignments, newAssignment] })
        setSelectedApp('') // Reset selections
        setSelectedRole('')
      } else {
        alert('This application has already been assigned. Please choose another.')
      }
    }
  }

  const columns = [
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'S No.',
      field: 'userID',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
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
            {params.row.userName}
          </Typography>
        </Tooltip>
      )
    },

    {
      flex: 0.2,
      minWidth: 170,
      headerName: 'Company Name',
      field: 'company',
      renderCell: params => (
        <Tooltip title={params.row.company.name}>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.company.name}
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
    },
    {
      flex: 0.2,
      minWidth: 30,
      headerName: 'Action',
      field: 'action',
      renderCell: params => (
        <Button size="small" variant='contained' onClick={() => handleDelete(params.row.id)} >Delete</Button>

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

  // Get roles for the selected application
  const roles = selectedApp ? applicationsData.find(app => app.id === selectedApp)?.roles : []
  const getRoleId = roleName => {
    const roleMap = {
      Auth_Admin: 2,
      Admin: 3,
      User: 4,
      Tele_Marketer: 5,
      Mobile: 6,
      Manufacturer: 7,
      Tele_Marketer_Manager: 8,
      Product_advocate: 9,
      Support: 10,
      Pharmacy: 11,
      Distributor: 12
      // Add more mappings as needed
    }
    return roleMap[roleName] || null // Return null if no matching role ID is found
  }

  // Transforming the input data to the desired output format
  const transformData = data => {
    return {
      access: data.map(item => ({
        role_id: getRoleId(item.role),
        application_id: item.appId
      }))
    }
  }

  const handleRemoveAssignment = index => {
    const updatedAssignments = [...state.assignments]
    updatedAssignments.splice(index, 1)
    setState({ ...state, assignments: updatedAssignments })
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
        <form onSubmit={isUpdate ? handleUpdate : handleSubmit}>
          <DialogTitle id='alert-dialog-title'>{isUpdate ? 'Update User' : 'Add New User'}</DialogTitle>
          <DialogContent>
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <Grid container>
                    <FormControl sx={{ width: 400, mb: 6 }}>
                      <TextField
                        required
                        type='text'
                        value={state.username}
                        onChange={e => setState({ ...state, username: e.target.value })}
                        id='standard-basic'
                        name='username'
                        label='Username'
                        placeholder='Enter username'
                        variant='standard'
                      />
                    </FormControl>
                    <FormControl sx={{ width: 400, mb: 6 }}>
                      <TextField
                        required
                        type='email'
                        value={state.email}
                        onChange={e => setState({ ...state, email: e.target.value })}
                        id='standard-basic'
                        name='email'
                        label='Email'
                        placeholder='Enter email address'
                        variant='standard'
                      />
                    </FormControl>
                    {!isUpdate && (
                      <FormControl sx={{ width: 400, mb: 6 }}>
                        <TextField
                          required
                          type='password'
                          value={state.password}
                          onChange={e => setState({ ...state, password: e.target.value })}
                          id='standard-basic'
                          name='password'
                          label='Set Password'
                          placeholder='Set password for user'
                          variant='standard'
                        />
                      </FormControl>
                    )}
                    <FormControl fullWidth margin='normal'>
                      <InputLabel id='company-select-label'>Select Company</InputLabel>
                      <Select
                        labelId='company-select-label'
                        id='company-select'
                        value={state.selectedCompany}
                        label='Select Company'
                        onChange={e => setState({ ...state, selectedCompany: e.target.value })}
                      >
                        {state.companies.map(company => (
                          <MenuItem key={company.id} value={company.id}>
                            {company.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <br />
                    <Typography variant='subtitle1' sx={{ width: '100%', marginBottom: 2, marginTop: 2 }}>
                      Assign Applications:
                    </Typography>
                    <FormControl fullWidth margin='normal'>
                      <InputLabel id='app-select-label'>Application</InputLabel>
                      <Select
                        labelId='app-select-label'
                        id='app-select'
                        value={selectedApp}
                        label='Application'
                        onChange={e => setSelectedApp(e.target.value)}
                      >
                        {applicationsData.map(app => (
                          <MenuItem key={app.id} value={app.id}>
                            {app.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                      <InputLabel id='role-select-label'>Role</InputLabel>
                      <Select
                        labelId='role-select-label'
                        id='role-select'
                        value={selectedRole}
                        label='Role'
                        onChange={e => setSelectedRole(e.target.value)}
                        disabled={!selectedApp}
                      >
                        {roles.map(role => (
                          <MenuItem key={role.id} value={role.name}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box>
                      <Button
                        variant='contained'
                        onClick={handleAddAssignment}
                        disabled={!selectedApp || !selectedRole}
                      >
                        Assign Access
                      </Button>
                      <List>
                        {state.assignments.map((assign, index) => (
                          <ListItem key={index} style={{ paddingLeft: '0px' }}>
                            <ListItemText primary={`${assign.app} - ${assign.role}`} />
                            <Box
                              ml={2}
                              sx={{ cursor: 'pointer', ':hover': { color: 'red' } }}
                              onClick={() => handleRemoveAssignment(index)}
                            >
                              x
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </DialogContent>

          <DialogActions className='dialog-actions-dense'>
            <Button onClick={handleClose}>Close</Button>
            {!isUpdate ? (
              <Button type='submit' variant='contained'>
                {'Create'}
              </Button>
            ) : (
              <Button type='submit' variant='contained'>
                Update
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>

      <Card>
        <CardHeader
          title='Users'
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
                Create new user
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

export default TableServerSide
