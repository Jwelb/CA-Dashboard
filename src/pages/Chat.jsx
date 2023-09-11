import React from "react";
import Navbar from "../components/Navbar";
import { Field, Formik, Form } from 'formik'
import * as Yup from "yup" ;
import { HStack, VStack, Input, Text, Box, Button } from "@chakra-ui/react";
import { useState } from 'react';
import TextField from "../components/TextField";


function Chat(){

    const [answer, setAnswer] = useState('initial')

  const getResponse = ({...props}) => {
      setAnswer('Request recieved')
      // Need to connect to back-end
  }

  return (
    <Formik
    initialValues = {{question: ''}}
    validationSchema = {Yup.object({
      question: Yup.string().required("Please enter a question")
    })}
    onSubmit={(values, actions) => {
      const vals = {...values} ;
      console.log(vals)
      getResponse(vals)
      actions.resetForm()
      }}
    >

      {(formik) => (
        <HStack 
        w="100%" 
        spacing={'70vh'}
        as={Form}>

        {Navbar()}
    
          <VStack spacing={50}>
      
            <HStack spacing={50}>
      
              <TextField 
                name='question'
                placeholder={"Question goes here"}
                autoComplete="off"
                width='40vh'
                height='5vh'
              />
            
              <Button 
              type='submit'
              height='3vh'>
                Submit
              </Button>

            </HStack>
            <Text opacity={answer == 'initial' ? 0 : 1}>{answer}</Text>
        </VStack>
      </HStack>
      )}
    </Formik>
  );
};
  
export default Chat;