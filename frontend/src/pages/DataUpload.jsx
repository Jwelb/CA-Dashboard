import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import axios from "axios";
import {
  HStack, 
  VStack, 
  Text, 
  Stack,
  Box, 
  Radio,
  RadioGroup,
  Button, 
  ScaleFade, 
  useColorModeValue, 
  Collapse, 
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure
} from '@chakra-ui/react'

const DataUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const fileContents = event.target.result;
            console.log(fileContents)
            sendFileContentsToServer(fileContents);
        }

        reader.readAsText(file);
      };

    const sendFileContentsToServer = async (contents) => {
        console.log(contents)
        await axios({
            method: 'post',
            url: '/uploadSolrFile',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: contents
            }).then((response) => {
            console.log(response)
            }).catch((error) => {
            console.log(error)
            });
    };
    

  return (
    <HStack
    w="100%"
    h='100%'>
    <Box>{Navbar()}</Box>
    <div>
    <div>
        <input type="file" onChange={handleFileChange} />
        <Button type='submit' onClick={handleUpload} disabled={!file}>Upload File</Button>
        </div>
    </div>
    </HStack>
  )
}

export default DataUpload