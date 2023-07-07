// ** React Imports
import { useEffect, useState, useCallback } from 'react'
// import ReactQuill from 'react-quill';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// import 'react-quill/dist/quill.bubble.css';
// import 'react-quill/dist/quill.core.css';
// import 'react-quill/dist/quill.snow.css';


// ** MUI Imports

import FormControl from '@mui/material/FormControl'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent'
import axios from 'axios'
import toast from 'react-hot-toast'
const  BASE_URL=process.env.NEXT_PUBLIC_BASE_URL


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

const QuillNoSSRWrapper = dynamic(
  () => import('react-quill'), 
  { ssr: false } // This line is important. It's what prevents server-side render
);

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

export default function AddTemplate(){
  const router=useRouter()
  const [value,setValue]=useState('')
    const [template,setTemplate]=useState({
        id:false,
        name:"",
        body:""
    })

    const handleChange=(e)=>{
      setTemplate({
        ...template,
        [e.target.name]:e.target.value
      })
    }

    const handleSubmit=async(e)=>{
      e.preventDefault()
      try{
        await axios.post(BASE_URL+"/templates",{name:template.name,body:value})
        setTemplate({
          name:"",
          body:""
        })
        setValue('')
        toast.success('Template added successfully.', {
          duration: 2000
        })
       
      }
      catch(e){

      }
      
    }

    return(
     <Card style={{height:"600px"}}>
        <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Grid container >
             
            <form onSubmit={handleSubmit}>
            <FormControl sx={{ mt: 1,width:700 }}>
              <TextField value={template.name} fullWidth name="name" onChange={handleChange} id="outlined-basic" label="Name" variant="outlined" />
            </FormControl>
            <FormControl sx={{ml:10,mt:3}}>
                <Button type="submit" variant='contained'>Add</Button>
            </FormControl>
            <FormControl sx={{mt: 6}}>
            <QuillNoSSRWrapper style={{width:"900px",height:"400px"}}  theme="snow" modules={modules} formats={formats} value={value} onChange={setValue} />
              {/* <TextField value={template.body} fullWidth multiline name="body" onChange={handleChange} minRows={15}  id="outlined-basic" label="Body" variant="outlined" /> */}
            
            </FormControl>
            </form>
          
           

                </Grid>
              </Grid>
            </Grid>
          </CardContent>

     </Card>

    )

}

