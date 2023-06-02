// ** React Imports
import { useContext, useState } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import toast from 'react-hot-toast'
import RegisterManufacturerForm from 'src/pages/register-form'
import { BASE_URL } from 'src/configs/config'

const RegisterManufacturer = () => {
  const [email, setEmail] = useState('')

  // ** Hooks

  const ability = useContext(AbilityContext)

  return (
    <Grid container spacing={6}>
      {ability?.can('read', 'manufacturer') ? (
        <Grid item md={12} xs={12}>
          <RegisterManufacturerForm />
        </Grid>
      ) : null}
    </Grid>
  )
}
RegisterManufacturer.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default RegisterManufacturer
