import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  HStack, 
  Box, 
  Button, 
} from '@chakra-ui/react'

const DataUpload = () => {
    const [files, setFiles] = useState(null);

    const handleChange = (event) => {
      setFiles(event.target.files)
    }

    const handleUpload = async () => {
        if(!files){
          console.log('no file selected')
          return
        }

        const formData = new FormData() ;

        for(let i = 0 ; i < files.length ; i++){
          formData.append(`files[${i}]`, files[0])
        }
        console.log([...formData, formData.entries()])
        fetch('http://localhost:4000/uploadSolrFile', {
          method: 'POST',
          body: formData
        }).then(res => console.log(res))
    };
  return (
    <HStack
    w="100%"
    h='100%'>
    <Box>{Navbar()}</Box>
    <div>
    <div>
        <input type="file" multiple onChange={handleChange} />
        <Button type='submit' onClick={handleUpload} disabled={!files}>Upload Files</Button>
        </div>
    </div>
    </HStack>
  )
}

export default DataUpload