import React from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from 'formik'
import * as Yup from "yup" ;
import { HStack, VStack, Input, Text, Box, Button } from "@chakra-ui/react";
import { useState } from 'react';
import TextField from "../components/TextField";
import { useEffect } from "react";


function Chat(){

  const [answer, setAnswer] = useState('initial')

  const getResponse = ({...props}) => {
      setAnswer(props.question)
      //fetch()
      //  .then(response => response.json())
  }

  return (
    <Formik
    initialValues = {{question: ''}}
    validationSchema = {Yup.object({
      question: Yup.string().required("Please enter a question")
    })}
    onSubmit={(values, actions) => {
      const vals = {...values} ;
      getResponse(vals)
      actions.resetForm()
      }}
    >

      {(formik) => (
        <HStack 
        w="100%"  
        as={Form}>
        
        <VStack>
          {Navbar()}
        </VStack>

        <VStack id='chatCenter' spacing={50}>
      
            <HStack spacing={20}>
      
              <TextField 
                name='question'
                placeholder={"Question goes here"}
                autoComplete="off"
                width='40vh'
                height='5vh'
                borderColor="black"
              />
            
              <Button 
              type='submit'
              height='3vh'
              id='link'>
                Submit
              </Button>
            </HStack>
            <Text opacity={answer == 'initial' ? 0 : 1}>
                  request recieved as: {answer}
            </Text>
        </VStack>
      </HStack>
      )}
    </Formik>
  );
};
  
export default Chat;