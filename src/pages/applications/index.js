import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'

// icons
import LockOpenIcon from 'mdi-material-ui/LockOpen'
import EmailIcon from 'mdi-material-ui/Email'
import PhoneIcon from 'mdi-material-ui/Phone'
import QrCodeIcon from 'mdi-material-ui/Qrcode'
import MedicationIcon from 'mdi-material-ui/MedicalBag'
import axios from 'axios'
import { Icon } from '@mui/material'
import { Box } from 'mdi-material-ui'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const TableServerSide = () => {
  const router = useRouter()
  const [applications, setApplications] = useState([])



  const fetchApplications = async () => {
    try {
      const response = await axios.get(BASE_URL + '/applications/findMyApplications', {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
        }
      })

      console.log(response.data)
      setApplications(response.data)
      //setCities(response.data)
      //  setFilteredCities(response.data.slice(0,20))
    } catch (e) {
      console.log(e)
      // fetchCities()
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])
  // Function to handle inner card click
  const handleCardClick = link => {
    window.open(`${link}/?token=${window.localStorage.getItem('accessToken')}`, '_blank');
  }

  const applicationIcons = {
    AUTH: <LockOpenIcon style={{ fontSize: '30px' }} />,
    EMS: <EmailIcon style={{ fontSize: '30px' }} />,
    Samodrie: <PhoneIcon style={{ fontSize: '30px' }} />,
    ASCThem: <QrCodeIcon style={{ fontSize: '30px' }} />,
    PHARMACY_PORTAL: <MedicationIcon style={{ fontSize: '30px' }} />
  }

  return (
    <Card sx={{ maxWidth: '100%', mt: 4, mx: 'auto', padding: 2 }}>
      {/* Outer Card */}
      <Typography variant='h4' component='div' sx={{ textAlign: 'center', mb: 2, mt: 2 }}>
        Applications
      </Typography>
      <CardContent>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          {applications.filter(card => card.id !== 1).map(card => (



            <Card
              sx={{
                flexGrow: 1,
                height: '200px',
                width: '200px',
                '@media (max-width: 600px)': {
                  width: '100%',
                  height: '100px',
                  fontSize: '14px'
                },

                fontSize: '20px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                // backgroundColor: '#f0f0f0',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #CECAE3',
                borderRadius: '10px',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  backgroundColor: '#f0f0f0',
                  color: 'black'
                },
                cursor: 'pointer'
              }}
              onClick={() => handleCardClick(card.url)}
            >
              {applicationIcons[card.name]}
              <Typography variant='h8' sx={{ textAlign: 'center', marginTop: '10px' }}>
                {card.name}
              </Typography>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TableServerSide
