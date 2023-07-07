// ** React Imports
import { useCallback, useContext, useState, useEffect } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'
import axios from 'axios'
const  BASE_URL=process.env.NEXT_PUBLIC_BASE_URL

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

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
    headerName: 'Is Active',
    field: 'is_active',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.is_active ? '1' : '0'}
      </Typography>
    )
  }
]

const ShowManufacturer = () => {
  // ** State
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(7)
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('id')
  const [sort, setSort] = useState('asc')
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  // ** Hooks
  const ability = useContext(AbilityContext)

  const fetchTableData = useCallback(
    async (sort, column) => {
      await axios
        .get(BASE_URL+"user/manufacturer-user", {
          params: {
            sort,
            column
          }
        })
        .then(res => {
          setTotal(res.data.length)
          setRows(loadServerRows(page, res.data))
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  )

  useEffect(() => {
    fetchTableData(sort, sortColumn)
  }, [fetchTableData, sort, sortColumn])

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('id')
    }
  }

  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }

  return (
    <Card>
      {ability?.can('read', 'manufacturer') ? (
        <>
          <CardHeader title='Manufacturers List' />
          <DataGrid
            autoHeight
            pagination
            rows={rows}
            rowCount={total}
            columns={columns}
            checkboxSelection
            pageSize={pageSize}
            sortingMode='server'
            paginationMode='server'
            onSortModelChange={handleSortModel}
            rowsPerPageOptions={[7, 10, 25, 50]}
            onPageChange={newPage => setPage(newPage)}
            components={{ Toolbar: ServerSideToolbar }}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            componentsProps={{
              toolbar: {
                value: searchValue,
                clearSearch: () => handleSearch(''),
                onChange: event => handleSearch(event.target.value)
              }
            }}
          />
        </>
      ) : null}
    </Card>
  )
}

ShowManufacturer.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default ShowManufacturer
