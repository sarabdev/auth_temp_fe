import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import axios from 'axios';
const  BASE_URL=process.env.NEXT_PUBLIC_BASE_URL
const TableServerSide = () => {
  const router = useRouter();
  const [applications, setApplications]= useState([])

  const [cards, setCards] = useState([
    { id: 1, title: "First Inner Card", link: "/first" },
    { id: 2, title: "Second Inner Card", link: "/second" },
    { id: 3, title: "Third Inner Card", link: "/third" },
  ]);

  const fetchApplications=async ()=>{
    try{
        const response=await axios.get(BASE_URL+"/companies/findMyCompany",{
          headers: {
            Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
          }
        });

        console.log(response.data)
        setApplications(response.data[0].applications)
        //setCities(response.data)
      //  setFilteredCities(response.data.slice(0,20))
        }
        catch(e){
            console.log(e)
         // fetchCities()
        }
  }

  useEffect(()=>{
   fetchApplications()
  },[])
  // Function to handle inner card click
  const handleCardClick = (link) => {
    router.push(link);
  };

  return (
    <Card sx={{ maxWidth:"100%", mt: 4, mx: 'auto', padding: 2 }}> {/* Outer Card */}
      <Typography variant="h4" component="div" sx={{ textAlign: 'center', mb: 2 }}>
        Applications
      </Typography>
      <CardContent>
        <Grid container spacing={2} justifyContent="center">
          {applications.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Card sx={{ height: '100%' }}> {/* Inner Card */}
                <CardActionArea onClick={() => handleCardClick(card.link)}>
                  <Typography variant="h6" sx={{ textAlign: 'center', padding: 2 }}>
                    {card.name}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TableServerSide;
