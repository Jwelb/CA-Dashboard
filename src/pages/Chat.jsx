import React from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from 'formik'
<<<<<<< HEAD
import * as Yup from "yup";
import { HStack, VStack, Text, Box, Button, Progress, Collapse } from "@chakra-ui/react";
import { useState } from 'react';
import TextField from "../components/TextField";
import axios from 'axios'
import { useDisclosure } from "@chakra-ui/react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tag,
  TagLabel
} from '@chakra-ui/react'
=======
import * as Yup from "yup" ;
import { HStack, VStack, Input, Text, Box, Button, Container } from "@chakra-ui/react";
import { useState } from 'react';
import TextField from "../components/TextField";
import axios from 'axios'
import { useEffect } from "react";

>>>>>>> 739636c0d3778d28086c081b87279d8cedd2197e

function Chat(){

<<<<<<< HEAD
const Chat = () => {

  const [answers, setAnswers] = useState([])
  const [questions, setQuestions] = useState([])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const [loading, setLoading] = useState(false)

  const getAnswer = async (vals) => {
    setQuestions(prevQuestions => [...prevQuestions, vals])
    setLoading(true)
    await axios({
      method: 'post',
      url: 'http://localhost:4000/getAnswer',
      headers: {
        'content-type': 'application/json',
      },
      data: {
        question: vals
      }
    }).then(data => {
        return data.data
      }).then(data => {
        setAnswers(prevAnswers => [...prevAnswers, data])
        setLoading(false)
      })
=======
  const [answer, setAnswer] = useState('initial')
  const [question, setQuestion] = useState('initial')
  const [data, setData] = useState('')
  //input the data into the flask
  const getResponse = ({...props}) => {
      setAnswer(props.question)
      console.log(props.question)
      props.preventDefault();
      // Need to connect to back-end
>>>>>>> 739636c0d3778d28086c081b87279d8cedd2197e
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
<<<<<<< HEAD
        <HStack
          w="100%"
          as={Form}>
          
          <VStack>{Navbar()}</VStack>

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
                    Roger that
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          <VStack height='100vh' w='100vw'>

            <HStack w={'100%'} mt='5vh'>

              <Box h='85vh' w='30vw' ml='7vw' className="inputOutput">

                <Text align={'center'} fontWeight={'bold'} fontSize={20}>Output</Text>
                  <Box border='1px' padding={'15px'}>
                      {answers.map((answer, index) => {
                      return (
                        <Box mb='1vh' mt='1vh' key={index}>

                          <Tag size={'sm'} colorScheme='teal' variant={"outline"}>
                              <TagLabel>
                                Response {index + 1}: 
                              </TagLabel>
                          </Tag>

                          <Text noOfLines={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} fontSize={20}>
                            {answer}
                          </Text>
                          
                        </Box>
                      )})}

                      {(loading) ? <Progress size='xs' isIndeterminate /> : null}

                    </Box>
              </Box>

              <Box h='85vh' w='30vw' ml='7vw' className="inputOutput">
                <Text align={'center'} fontWeight={'bold'} fontSize={20}>Input</Text>
                  <Box  border='1px' padding={'15px'}>
                    {questions.map((question, index) => {
                      return (
                        <Box mb='1vh' mt='1vh' key={index}>
                          <Tag size={'sm'} colorScheme='red' variant={"outline"}>
                                <TagLabel>
                                Question {index + 1}: 
                                </TagLabel>
                          </Tag>
                          <Text noOfLines={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} fontSize={20}>
                            {question}
                          </Text>
                        </Box>
                      )})}
                  </Box>
              </Box>
=======
        <HStack 
        w="100%"  
        as={Form}>
        
        <VStack>
          {Navbar()}
        </VStack>
>>>>>>> 739636c0d3778d28086c081b87279d8cedd2197e

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