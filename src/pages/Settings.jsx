import React, { useContext, useEffect, useState } from "react";
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
  const [llamaEnv, llamaEnvChange] = useState('initial')
  const [solrEnv, solrEnvChange] = useState('initial')

  const {env} = useContext(EnvContext)
  const {setEnv} = useContext(EnvContext)

  const changeEnvironmentSettings = ({...vals}) => {
    console.log(vals)
    switch(formToChange){
      case 'llamaEnvironment':
        vals.llamaEnvironment = llamaEnv
        vals.llamaTargetAddress = env.llamaTargetAddress
        vals.llamaPortNumber = env.llamaPortNumber
        vals.solrEnvironment = env.solrEnvironment
        vals.solrTargetAddress = env.solrTargetAddress
        vals.solrPortNumber = env.solrPortNumber
        break
      case 'llamaTargetAddress':
        vals.llamaEnvironment = env.llamaEnvironment
        vals.llamaPortNumber = env.llamaPortNumber
        vals.solrEnvironment = env.solrEnvironment
        vals.solrTargetAddress = env.solrTargetAddress
        vals.solrPortNumber = env.solrPortNumber
        break
      case 'llamaPortNumber':
        vals.llamaTargetAddress = env.llamaTargetAddress
        vals.llamaEnvironment = env.llamaEnvironment
        vals.solrEnvironment = env.solrEnvironment
        vals.solrTargetAddress = env.solrTargetAddress
        vals.solrPortNumber = env.solrPortNumber
        break
      case 'solrEnvironment':
        vals.solrEnvironment = solrEnv
        vals.solrTargetAddress = env.solrTargetAddress
        vals.solrPortNumber = env.solrPortNumber
        vals.llamaTargetAddress = env.llamaTargetAddress
        vals.llamaEnvironment = env.llamaEnvironment
        vals.llamaPortNumber = env.llamaPortNumber
        break
      case 'solrTargetAddress':
        vals.solrEnvironment = env.solrEnvironment
        vals.solrPortNumber = env.solrPortNumber
        vals.llamaTargetAddress = env.llamaTargetAddress
        vals.llamaEnvironment = env.llamaEnvironment
        vals.llamaPortNumber = env.llamaPortNumber
        break
      case 'solrPortNumber':
        vals.solrEnvironment = env.solrEnvironment
        vals.solrTargetAddress = env.solrTargetAddress
        vals.llamaTargetAddress = env.llamaTargetAddress
        vals.llamaEnvironment = env.llamaEnvironment
        vals.llamaPortNumber = env.llamaPortNumber
        break
    }

    vals.chatHistory = env.chatHistory
    vals.searchHistoryDocs = env.searchHistoryDocs
    vals.searchHistoryGoogleDocs = env.searchHistoryGoogleDocs
    vals.documentBuildContents = env.documentBuildContents
    vals.currentDocument = env.currentDocument

    console.log(vals)
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
        llamaTargetAddress: '127.0.0.1', 
        llamaPortNumber: '5000',
        solrTargetAddress: '127.0.0.1', 
        solrPortNumber: '8983'}}
      validationSchema={Yup.object({ 
        llamaTargetAddress: Yup.string(), 
        solrTargetAddress: Yup.string(),
        llamaPortNumber: Yup.string(), 
        solrPortNumber: Yup.string(), 
        llamaEnvironment: Yup.string(),
        solrEnvironment: Yup.string(),
       })}
      onSubmit={(values, actions) => {
        const vals = {...values, solrEnv, llamaEnv}
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
            name='solrTargetAddress'
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
              setFormToChange('solrTargetAddress')
            }}>
            Change
          </Button>
        </Box>
        </VStack>
        <VStack w='25%' h='30vh' mt='3%' ml="2%">
          <Box align={'center'} w='100%' h='100%' mt='3vh'>
            <Text>Solr Target Port Number</Text>
            <TextField
              name='solrPortNumber'
              placeholder={"8983"}
              autoComplete="off"
              h='5vh'
            />
            <Button
              type='submit'
              height='5vh'
              id='link'
              mt='1vh'
              onClick={() => {
                setFormToChange('solrPortNumber')
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
            name='solrEnvironment'
            value='solrEnvironment' 
            type='submit'
            height='5vh'
            id='link'
            bg={env.solrEnvironment == 'Production' ? 'teal' : 'grey'}
            onClick={() => {
              setFormToChange('solrEnvironment')
              solrEnvChange('Production')
            }}>
            Production
          </Button>
          <Button
            name='solrEnvironment' 
            value='solrEnvironment' 
            type='submit'
            height='5vh'
            id='link'
            bg={env.solrEnvironment == 'Development' ? 'teal' : 'grey'}
            onClick={() => {
              setFormToChange('solrEnvironment')
              solrEnvChange('Development')
            }}>
            Development
          </Button>
          </VStack>
          </Box>
        </VStack>
        <VStack  w='25%' h='30vh'>
          <Box align={'center'} w='100%' h='100%' mt='8vh'>
          <Text>Current Target IP: {env.solrTargetAddress}</Text>
          <Text>Current Port Number: {env.solrPortNumber}</Text>
          <Text>Current Server Usage: {env.solrEnvironment}</Text>
          </Box>
        </VStack>
      </HStack>
       
      <HStack w='90%' rounded={3} h='30vh'>
        <VStack w='25%' h='30vh' mt='3%' ml='2%'>
        <Box align={'center'} w='100%' h='100%' mt='3vh'>
          <Text>Llama Target IP Address</Text>
          <TextField
            name='llamaTargetAddress'
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
              setFormToChange('llamaTargetAddress')
            }}>
            Change
          </Button>
        </Box>
        </VStack>
        <VStack w='25%' h='30vh' mt='3%' ml="2%">
          <Box align={'center'} w='100%' h='100%' mt='3vh'>
            <Text>Llama Target Port Number</Text>
            <TextField
              name='llamaPortNumber'
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
                setFormToChange('llamaPortNumber')
              }}>
              Change
            </Button>
          </Box>
        </VStack>
        <VStack  w='25%' h='30vh' mt='3%'>
        <Box align={'center'} w='100%' h='100%' mt='3vh'>
          <Text mb='1vh'>Llama Server Usage</Text>
          <VStack>
          <Button
            name='llamaEnvironment'
            value='llamaEnvironment' 
            type='submit'
            height='5vh'
            id='link'
            bg={env.llamaEnvironment == 'Production' ? 'teal' : 'grey'}
            onClick={() => {
              setFormToChange('llamaEnvironment')
              llamaEnvChange('Production')
            }}>
            Production
          </Button>
          <Button
            name='llamaEnvironment' 
            value='llamaEnvironment' 
            type='submit'
            height='5vh'
            id='link'
            bg={env.llamaEnvironment == 'Development' ? 'teal' : 'grey'}
            onClick={() => {
              setFormToChange('llamaEnvironment')
              llamaEnvChange('Development')
            }}>
            Development
          </Button>
          </VStack>
          </Box>
        </VStack>
        <VStack  w='25%' h='30vh'>
          <Box align={'center'} w='100%' h='100%' mt='8vh'>
          <Text>Current Target IP: {env.llamaTargetAddress}</Text>
          <Text>Current Port Number: {env.llamaPortNumber}</Text>
          <Text>Current Server Usage: {env.llamaEnvironment}</Text>
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