
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
          as={Form}>
          
          <VStack>
            {Navbar()}
          </VStack>

          <VStack w='100%'>
            <HStack w='100%'>
              <VStack w='33%' bg='' h='20vh'>
              <Text>Llama Target IP Address</Text>
              <TextField
                name='targetAddress'
                placeholder={"127.0.0.1"}
                autoComplete="off"
                h='5vh'
                borderColor="black"
              />
              <Button
                type='submit'
                height='5vh'
                id='link'
                onClick={() => {
                  setFormToChange('targetAddress')
                }}>
                Change
              </Button>
            </VStack>

            <VStack w='33%' bg='' h='20vh'>
              <Text>Llama Target Port Number</Text>
              <TextField
                name='portNumber'
                placeholder={"5000"}
                autoComplete="off"
                h='5vh'
                borderColor="black"
              />
              <Button
                type='submit'
                height='5vh'
                id='link'
                onClick={() => {
                  setFormToChange('portNumber')
                }}>
                Change
              </Button>
            </VStack>

            <VStack w='33%' bg='' h='25vh' mt='5vh'>
            <Text mb='1vh'>Llama Server Usage</Text>
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
          
          </HStack>

          <Box w='100%' align={'center'}>
              <Text>Current Target IP: {env.targetAddress}</Text>
              <Text>Current Port Number: {env.portNumber}</Text>
              <Text>Current Llama Server Usage: {env.environment}</Text>
          </Box>
        </VStack>
        </HStack>
        
      )}
    </Formik>
  )
};
  
export default Settings;