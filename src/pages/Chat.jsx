import React from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from 'formik'
import * as Yup from "yup" ;
import { HStack, VStack, Text, Box, Button} from "@chakra-ui/react";
import { useState, setState} from 'react';
import TextField from "../components/TextField";
import axios from 'axios'
import { useDisclosure } from "@chakra-ui/react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'

const Chat = () => {

  const [answers, setAnswers] = useState([])
  const [questions, setQuestions] = useState([])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const getAnswer = (vals) => {
    setQuestions(prevQuestions => [...prevQuestions, vals])

    console.log(questions)
    axios({
      method: 'post',
      url: 'http://localhost:4000/test',
      headers: {
        'content-type': 'application/json',
      },
      data: {
        question: vals
      }
    }).catch(err => {
      return
    })
    .then(data => {
      return data.data
    }).then(data => {
      setAnswers(prevAnswers => [...prevAnswers, data])
    })
  }


  return (
    <Formik
    initialValues = {{question: ''}}
    validationSchema = {Yup.object({question: Yup.string()})}
    onSubmit={(values, actions) => {
      if(values.question.trim() == ""){
        {onOpen()}
        return
      }
      actions.resetForm()
      getAnswer(values.question)
    }}>

  
      {(formik) => (
        <HStack 
        w="100%"  
        as={Form}>

        {/* Alert Box */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Enter some input
            </AlertDialogHeader>

            <AlertDialogBody>
              Please enter a question so that we can answer it!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Roger that, batman.
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>

      </AlertDialog>
        
        <VStack>
          {Navbar()}
        </VStack>

        <VStack height='100vh' w='100vw'>

            <HStack w={'100%'} mt='5vh'>

            <Box h='85vh' w='40vw' bg='grey'>
                <ul className='answerList'>
                  <Text align={'center'}>Answers</Text>
                  {answers.map((answer, index) => {
                  return (
                    <div>
                      <Text noOfLines={[1,2,3]} key={index}>
                        {answer}</Text>
                    </div>
                    )})}
                </ul>
              </Box>

              <Box h='85vh' w='40vw' bg='grey'>
                <ul className='questionList'>
                  <Text align={'center'}>Questions</Text>
                  {questions.map((question, index) => {
                  return (
                    <div>
                      <Text noOfLines={[1,2,3]} key={index}>
                        {question}</Text>
                    </div>
                    )})}
                </ul>
              </Box>

            </HStack>

            <Box mt='2vh'> 
              <HStack>

                <TextField 
                  name='question'
                  placeholder={"Question goes here"}
                  autoComplete="off"
                  width='70vw'
                  height='5vh'
                  borderColor="black"
                />

                <Button 
                type='submit'
                height='5vh'
                id='link'>
                  Submit
                </Button>
                
              </HStack>
            </Box>
        </VStack>

      </HStack>
    )}
  </Formik>
)}
  
export default Chat;