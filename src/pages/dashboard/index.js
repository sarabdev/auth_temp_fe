// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
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


  const handleClose = () => setOpen(false)

  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  const fetchTableData = useCallback(
    async (sort, column) => {
      setIsLoading(true)
      try{
      await axios
        .get(`${BASE_URL}/users`,{
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

  const MUITableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: 0,
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
    paddingTop: `${theme.spacing(1)} !important`,
    paddingBottom: `${theme.spacing(1)} !important`
  }))

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
      headerName: 'Username',
      field: 'username',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.username}
        </Typography>
      )

    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Email',
      field: 'email',
      renderCell: params => (
        <Tooltip title={params.row.email}>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.email}
          </Typography>
        </Tooltip>
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
        <DialogTitle id='alert-dialog-title'>User Details</DialogTitle>
        <DialogContent>
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Grid container justifyContent='flex-end'>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography variant='body2'>User ID:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {userDetails?.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>Name:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {userDetails?.first_name + ' ' + userDetails?.last_name}
                          </Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Typography variant='body2'>Email:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {userDetails?.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>Mobile Number:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {userDetails?.mobile}
                          </Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Typography variant='body2'>Gender:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {userDetails?.gender}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>Verified:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {userDetails?.is_verified ? 'True' : 'Fasle'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </DialogContent>

        <DialogTitle id='alert-dialog-title'>Product Details</DialogTitle>
        <DialogContent>
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Grid container justifyContent='flex-end'>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography variant='body2'>NDC Number:</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {productData?.NDC}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>Drug Name (Proprietary):</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {productData?.drugNameProprietary}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='body2'>Drug Name (Established):</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {productData?.drugNameEstablished}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>Dosage Form:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {productData?.dosageForm}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='body2'>Dosage Strength:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {productData?.dosageStrength}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>Quantity</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {productData?.quantity}
                          </Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow></TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='body2'>Packaging Type:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {productData?.packageType}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>Expire Date:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {new Date(productData?.expirationDate).toLocaleDateString()}{' '}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        {/* <TableCell>
                          <Typography variant='body2'>Special Promotions:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {productData?.specialPromotions}
                          </Typography>
                        </TableCell> */}
                      </TableRow>
                      {/* <TableRow>
                        <TableCell>
                          <Typography variant='body2'>More Information:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {productData?.moreInformation}
                          </Typography>
                        </TableCell>
                      </TableRow> */}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Card>
        <CardHeader title='Users' />
        <DataGrid
          autoHeight
          pagination
          rows={isLoading?[]:rows}
          rowCount={total}
          columns={columns}
          pageSize={pageSize}
          loading={isLoading}
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
