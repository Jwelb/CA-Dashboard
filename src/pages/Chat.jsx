import React from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from 'formik'
import * as Yup from "yup" ;
import { HStack, VStack, Input, Text, Box, Button, Container } from "@chakra-ui/react";
import { useState } from 'react';
import TextField from "../components/TextField";
import axios from 'axios'
import {useEffect} from 'react'


function Chat(){

  const [answer, setAnswer] = useState('initial')
  const [question, setQuestion] = useState('initial')

  const [data, setData] = useState('')
  //input the data into the flask
  const getResponse = ({...props}) => {
      setAnswer(props.question)
      console.log(props.question)
      props.preventDefault();
      // Need to connect to back-end
  }

  return (
    <Formik
    initialValues = {{question: ''}}
    validationSchema = {Yup.object({
      question: Yup.string().required("Please enter a question")
    })}
    onSubmit={(values, actions) => {
      const vals = {...values} 
      actions.resetForm()
      axios({
        method: 'post',
        url: 'http://localhost:4000/test',
        headers: {
          'content-type': 'application/json',
        },
        data: {
          userQuestion: vals.question
        }
      })
      .then(response => {
        console.log(response.data) ;
      })
      }}>

  
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