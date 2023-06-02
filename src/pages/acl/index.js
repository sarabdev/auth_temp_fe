// // ** React Imports
// import { useContext } from 'react'

// // ** Context Imports
// import { AbilityContext } from 'src/layouts/components/acl/Can'

// // ** MUI Imports
// import Grid from '@mui/material/Grid'
// import Card from '@mui/material/Card'
// import CardHeader from '@mui/material/CardHeader'
// import Typography from '@mui/material/Typography'
// import CardContent from '@mui/material/CardContent'
// import GenerateBarcodeFormLayout from '../barcode-form'

// const ACLPage = () => {
//   // ** Hooks
//   const ability = useContext(AbilityContext)

//   return (
//     <Grid container spacing={6}>
//       <Grid item md={12} xs={12}>
//         <GenerateBarcodeFormLayout />
//       </Grid>
//       {ability?.can('read', 'manufacturer') ? (
//         <Grid item md={12} xs={12}>
//           <Card>
//             <CardHeader title='Register' />
//             <CardContent>
//               <Typography sx={{ mb: 4 }}>User with 'Analytics' subject's 'Read' ability can view this card</Typography>
//               <Typography sx={{ color: 'error.main' }}>This card is visible to 'admin' only</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       ) : null}
//     </Grid>
//   )
// }
// ACLPage.acl = {
//   action: 'read',
//   subject: 'acl-page'
// }

// export default ACLPage

// ** React Imports

import { useContext } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import GenerateBarcodeFormLayout from '../barcode-form'

const ACLPage = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)

  return (
    <Grid container spacing={6}>
      <Grid item md={12} xs={12}>
        <CardHeader title='Barcode' titleTypographyProps={{ variant: 'h6' }} />

        {/* <GenerateBarcodeFormLayout /> */}
      </Grid>
      {/* {ability?.can('read', 'manufacturer') ? (
        <Grid item md={12} xs={12}>
          <Card>
            <CardHeader title='Register' />
            <CardContent>
              <Typography sx={{ mb: 4 }}>User with 'Analytics' subject's 'Read' ability can view this card</Typography>
              <Typography sx={{ color: 'error.main' }}>This card is visible to 'admin' only</Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : null} */}
    </Grid>
  )
}
ACLPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default ACLPage
