
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
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
  

const Settings = () => {

  // Use effect to fetch what ip, port, and enviornment we are using 

  const resetTargetAddress = ({...vals}) => {
    const target = vals.targetAddress
    console.log(target)
    

  }

  const resetPortNumber = ({...vals}) => {
    const target = vals.portNumber
    console.log(target)
    
  }

  const resetEnvironment = (env) => {
    const target = env
    console.log(target)
  }

  const [formToChange, setFormToChange] = useState('initial')
  const [env, envToChange] = useState('initial')

  return (
    <Formik
      initialValues={{ targetAddress: '', portNumber: ''}}
      validationSchema={Yup.object({ 
        targetAdress: Yup.string(), 
        portNumber: Yup.string(), 
        environment: Yup.string() })}
      onSubmit={(values, actions) => {
        const vals = {...values}
        actions.resetForm()
        switch(formToChange){
          case "targetAddress":
            resetTargetAddress(vals) ;
            break ;
          case "portNumber": 
            resetPortNumber(vals);
            break ;
          case "environment":
            resetEnvironment(env) ;
            break ;
          default:
            break ;
          }
      }}>


      {(formik) => (
        <HStack
          w="100%"
          as={Form}>
          
          <VStack>
            {Navbar()}
          </VStack>

          <VStack w='33%' bg=''>
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

        <VStack w='33%' bg=''>
          <Text>Target Port Number</Text>
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

        <VStack w='33%' bg=''>
        <Text mb='1vh'>Llama Server Usage</Text>
            <Button
              name='Production'
              value='Production' 
              type='submit'
              height='5vh'
              id='link'
              onClick={() => {
                setFormToChange('environment')
                envToChange('Production')
              }}>
              Production
            </Button>
            <Button
              name='Development' 
              value='Development' 
              type='submit'
              height='5vh'
              id='link'
              onClick={() => {
                setFormToChange('environment')
                envToChange('Development')
              }}>
              Development
            </Button>
        </VStack>

        </HStack>
      )}
    </Formik>
  )
};
  
export default Settings;