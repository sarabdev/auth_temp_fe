// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'
const  BASE_URL=process.env.NEXT_PUBLIC_BASE_URL

// ** Icons Imports
import toast from 'react-hot-toast'
import Select from '@mui/material/Select'
import data from 'src/@fake-db/components/data'

const GenerateBarcodeFormLayout = () => {
  // ** States
  const [values, setValues] = useState({
    gtin: '',
    expDate: '',
    lot: '',
    snLength: 1,
    qrNum: 1,
    gtinFormat: '14'
  })

  const handleChange = field => event => {
    const value = event.target.value
    let error = ''

    if (field === 'gtin') {
      if (values.gtinFormat === '8' && value.length !== 8) {
        error = 'GTIN-8 should have exactly 8 digits'
      } else if (values.gtinFormat === '12' && value.length !== 12) {
        error = 'GTIN-12 should have exactly 12 digits'
      } else if (values.gtinFormat === '13' && value.length !== 13) {
        error = 'GTIN-13 should have exactly 13 digits'
      } else if (values.gtinFormat === '14' && value.length !== 14) {
        error = 'GTIN-14 should have exactly 14 digits'
      }
    }
    setValues({ ...values, [field]: value, error: error })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (values.error) {
      toast.error(values.error)
    }
    try {
      const response = await fetch(`${BASE_URL}barcode/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      const data = await response.json()

      if (response.status == 200) {
        toast.success(data.message, {
          duration: 2000
        })
      }

      if (response.status == 400) {
        toast.error(data.message[0], {
          duration: 2000
        })
      }

      // Do something with the data
    } catch (error) {
      console.error('Error:', error.message)
      toast.error(error.message, {
        duration: 2000
      })
    }
  }

  return (
    <Card>
      <CardHeader title='Generate Barcode' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <Select
                fullWidth
                label='GTIN Format'
                value={values.gtinFormat || ''}
                onChange={handleChange('gtinFormat')}
              >
                <MenuItem value='8'>GTIN-8</MenuItem>
                <MenuItem value='12'>GTIN-12</MenuItem>
                <MenuItem value='13'>GTIN-13</MenuItem>
                <MenuItem value='14'>GTIN-14</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label='GTIN'
                placeholder='Enter GTIN'
                value={values.gtin}
                onChange={handleChange('gtin')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Expire Date'
                type='date'
                value={values.expDate}
                onChange={handleChange('expDate')}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Lot Number'
                placeholder='Enter Lot Number'
                value={values.lot}
                onChange={handleChange('lot')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Serial Number Length'
                value={values.snLength}
                onChange={handleChange('snLength')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Barcode Numbers'
                placeholder='Enter Barcode Numbers'
                value={values.qrNum}
                onChange={handleChange('qrNum')}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button type='submit' variant='contained' size='large'>
                  Generate
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default GenerateBarcodeFormLayout
