import React, { useContext, useState } from "react";
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
} from '@chakra-ui/react'
import { EnvContext } from "../components/envContext";
  
const Settings = () => {
  const [formToChange, setFormToChange] = useState('initial')
  const [envir, envToChange] = useState('initial')

  const {env} = useContext(EnvContext)
  const {setEnv} = useContext(EnvContext)

  const changeEnvironmentSettings = ({...vals}) => {
    if(formToChange == 'targetAddress'){
      vals.environment = env.environment
      vals.portNumber = env.portNumber
    }else if(formToChange == 'portNumber'){
      vals.environment = env.environment
      vals.targetAddress = env.targetAddress
    }else{
      vals.targetAddress = env.targetAddress
      vals.portNumber = env.portNumber
    }

    vals.chatHistory = env.chatHistory
    vals.searchHistoryDocs = env.searchHistoryDocs
    vals.searchHistoryGoogleDocs = env.searchHistoryGoogleDocs
    vals.documentBuildContents = env.documentBuildContents

    fetch("http://localhost:4000/environmentSettings", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vals),
    })
    .catch(err => {
      return;
    })
    .then(res => {
      if (!res || !res.ok || res.status >= 400) {
        return; 
      }
      return res.json();
    })
    .then(data => {
        setEnv({...data}) ;
    });
  }

  return (
    <Formik
      initialValues={{
        targetAddress: '127.0.0.1', 
        portNumber: '5000'}}
      validationSchema={Yup.object({ 
        targetAdress: Yup.string(), 
        portNumber: Yup.string(), 
        environment: Yup.string() })}
      onSubmit={(values, actions) => {
        const vals = {...values, environment: envir}
        actions.resetForm()
        changeEnvironmentSettings(vals)
      }}>

  {(formik) => (
    <HStack
    w="100%"
    h='100%'
    as={Form}>
    <Box>{Navbar()}</Box>
    
    <VStack w='100%'>
      <HStack w='90%' rounded={5} h='30vh'>
        <VStack w='25%' h='30vh' mt='3%' ml='2%'>
        <Box align={'center'} w='100%' h='100%' mt='3vh'>
          <Text>Solr Target IP Address</Text>
          <TextField
            name='targetAddress'
            placeholder={"127.0.0.1"}
            autoComplete="off"
            w='100%'
            h='5vh'
          />
          <Button
            type='submit'
            height='5vh'
            id='link'
            mt='1vh'
            onClick={() => {
              setFormToChange('targetAddress')
              console.log(formToChange)
            }}>
            Change
          </Button>
        </Box>
        </VStack>
        <VStack w='25%' h='30vh' mt='3%' ml="2%">
          <Box align={'center'} w='100%' h='100%' mt='3vh'>
            <Text>Solr Target Port Number</Text>
            <TextField
              name='portNumber'
              placeholder={"5000"}
              autoComplete="off"
              h='5vh'
            />
            <Button
              type='submit'
              height='5vh'
              id='link'
              mt='1vh'
              onClick={() => {
                setFormToChange('portNumber')
              }}>
              Change
            </Button>
          </Box>
        </VStack>
        <VStack  w='25%' h='30vh' mt='3%'>
        <Box align={'center'} w='100%' h='100%' mt='3vh'>
          <Text mb='1vh'>Solr Server Usage</Text>
          <VStack>
          <Button
            name='environment'
            value='environment' 
            type='submit'
            height='5vh'
            id='link'
            bg={env.environment == 'Production' ? 'teal' : 'grey'}
            onClick={() => {
              setFormToChange('environment')
              envToChange('Production')
            }}>
            Production
          </Button>
          <Button
            name='environment' 
            value='environment' 
            type='submit'
            height='5vh'
            id='link'
            bg={env.environment == 'Development' ? 'teal' : 'grey'}
            onClick={() => {
              setFormToChange('environment')
              envToChange('Development')
            }}>
            Development
          </Button>
          </VStack>
          </Box>
        </VStack>
        <VStack  w='25%' h='30vh'>
          <Box align={'center'} w='100%' h='100%' mt='8vh'>
          <Text>Current Target IP: {env.targetAddress}</Text>
          <Text>Current Port Number: {env.portNumber}</Text>
          <Text>Current Server Usage: {env.environment}</Text>
          </Box>
        </VStack>
      </HStack>
       
      <HStack w='90%' rounded={3} h='30vh'>
        <VStack w='25%' h='30vh' mt='3%' ml='2%'>
        <Box align={'center'} w='100%' h='100%' mt='3vh'>
          <Text>Llama Target IP Address</Text>
          <TextField
            name='targetAddress'
            placeholder={"127.0.0.1"}
            autoComplete="off"
            w='100%'
            h='5vh'
          />
          <Button
            type='submit'
            height='5vh'
            id='link'
            mt='1vh'
            onClick={() => {
              setFormToChange('targetAddress')
              console.log(formToChange)
            }}>
            Change
          </Button>
        </Box>
        </VStack>
        <VStack w='25%' h='30vh' mt='3%' ml="2%">
          <Box align={'center'} w='100%' h='100%' mt='3vh'>
            <Text>Llama Target Port Number</Text>
            <TextField
              name='portNumber'
              placeholder={"5000"}
              autoComplete="off"
              h='5vh'
            />
            <Button
              type='submit'
              height='5vh'
              id='link'
              mt='1vh'
              onClick={() => {
                setFormToChange('portNumber')
              }}>
              Change
            </Button>
          </Box>
        </VStack>
        <VStack  w='25%' h='30vh' mt='3%'>
        <Box align={'center'} w='100%' h='100%' mt='3vh'>
          <Text mb='1vh'>Server Usage</Text>
          <VStack>
          <Button
            name='environment'
            value='environment' 
            type='submit'
            height='5vh'
            id='link'
            bg={env.environment == 'Production' ? 'teal' : 'grey'}
            onClick={() => {
              setFormToChange('environment')
              envToChange('Production')
            }}>
            Production
          </Button>
          <Button
            name='environment' 
            value='environment' 
            type='submit'
            height='5vh'
            id='link'
            bg={env.environment == 'Development' ? 'teal' : 'grey'}
            onClick={() => {
              setFormToChange('environment')
              envToChange('Development')
            }}>
            Development
          </Button>
          </VStack>
          </Box>
        </VStack>
        <VStack  w='25%' h='30vh'>
          <Box align={'center'} w='100%' h='100%' mt='8vh'>
          <Text>Current Target IP: {env.targetAddress}</Text>
          <Text>Current Port Number: {env.portNumber}</Text>
          <Text>Current Server Usage: {env.environment}</Text>
          </Box>
        </VStack>
      </HStack>

      {/*
      <HStack w='90%' rounded={3} h='30vh'>
        <VStack w='25%' h='30vh' mt='3%' ml='2%'>
        <Box align={'center'} w='100%' h='100%' mt='3vh'>
          <Text>Llama Target IP Address</Text>
          <TextField
            name='targetAddress'
            placeholder={"127.0.0.1"}
            autoComplete="off"
            w='100%'
            h='5vh'
          />
          <Button
            type='submit'
            height='5vh'
            id='link'
            mt='1vh'
            onClick={() => {
              setFormToChange('targetAddress')
              console.log(formToChange)
            }}>
            Change
          </Button>
        </Box>
        </VStack>
        <VStack w='25%' h='30vh' mt='3%' ml="2%">
          <Box align={'center'} w='100%' h='100%' mt='3vh'>
            <Text>Llama Target Port Number</Text>
            <TextField
              name='portNumber'
              placeholder={"5000"}
              autoComplete="off"
              h='5vh'
            />
            <Button
              type='submit'
              height='5vh'
              id='link'
              mt='1vh'
              onClick={() => {
                setFormToChange('portNumber')
              }}>
              Change
            </Button>
          </Box>
        </VStack>
        <VStack  w='25%' h='30vh' mt='3%'>
        <Box align={'center'} w='100%' h='100%' mt='3vh'>
          <Text mb='1vh'>Server Usage</Text>
          <VStack>
          <Button
            name='environment'
            value='environment' 
            type='submit'
            height='5vh'
            id='link'
            bg={env.environment == 'Production' ? 'teal' : 'grey'}
            onClick={() => {
              setFormToChange('environment')
              envToChange('Production')
            }}>
            Production
          </Button>
          <Button
            name='environment' 
            value='environment' 
            type='submit'
            height='5vh'
            id='link'
            bg={env.environment == 'Development' ? 'teal' : 'grey'}
            onClick={() => {
              setFormToChange('environment')
              envToChange('Development')
            }}>
            Development
          </Button>
          </VStack>
          </Box>
        </VStack>
        <VStack  w='25%' h='30vh'>
          <Box align={'center'} w='100%' h='100%' mt='8vh'>
          <Text>Current Target IP: {env.targetAddress}</Text>
          <Text>Current Port Number: {env.portNumber}</Text>
          <Text>Current Server Usage: {env.environment}</Text>
          </Box>
        </VStack>
      </HStack>
      */}
    </VStack>

  </HStack>
  )}
  </Formik>
  );
};
  
export default Settings;