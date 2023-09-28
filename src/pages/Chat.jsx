import React from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from 'formik'
import * as Yup from "yup";
import { HStack, VStack, Text, Box, Button, Progress, useColorModeValue, Collapse } from "@chakra-ui/react";
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
  TagLabel,
  Divider,
  Fade
} from '@chakra-ui/react'

import { HiChevronDoubleRight } from "react-icons/hi2";

const Chat = () => {

  const [questionAnswer, setQuestionAnswer] = useState([])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const [loading, setLoading] = useState(false)

  const buttonColor = useColorModeValue('#F4F7FF','#101720')

  const [chatOpen, setChatOpen] = useState(false)


  const getAnswer = async (vals) => {
    const currentIndex = questionAnswer.length; 
    const updatedAnswers = [...questionAnswer, { Question: vals, answer: null }];
    setLoading(true)
    await axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/generate_response',
      headers: {
        'Content-type': 'application/json',
      },
      data: {
        Question: vals
      }
    }).then(data => {
        console.log(data);
        return data.data
      }).then(data => {
        updatedAnswers[currentIndex].answer = data;
        setQuestionAnswer(updatedAnswers); 
        setChatOpen(true)
        setLoading(false)
      })
  }


  return (
    <Formik
      initialValues={{ question: '' }}
      validationSchema={Yup.object({ question: Yup.string() })}
      onSubmit={(values, actions) => {
        if (values.question.trim() == "") {
          {onOpen()}
          return
        }
        console.log(questionAnswer)
        actions.resetForm()
        getAnswer(values.question)
      }}>


      {(formik) => (
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
            <HStack 
            w={'100%'} 
            mt='5vh'
            overflowX="auto"
            whiteSpace="wrap"
            overflowY="auto">
              <Box h='85vh' w='70vw' ml='7vw' className="inputOutput" >
                  <Box padding={'10px'}>
                  
                      {questionAnswer.map((questionAnswer, index) => {
                      return (
                        <Box mb='1vh' mt='1vh' key={index}>
                              <Box mb='1vh' align={'right'} border='2px' rounded={10} padding={3} borderColor={"#676e79"}>
                                <Tag size={'sm'} colorScheme='blue' variant={"outline"}>
                                    <TagLabel>
                                    Question {index + 1}: 
                                    </TagLabel>
                                </Tag>
                                <Text noOfLines={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} fontSize={20}>
                                {questionAnswer.question}
                                </Text>
                              </Box>
                              
                              <Box mb='1vh' mt='1vh' align={'left'} border='2px' rounded={10} padding={3} borderColor={"#676e79"}>
                                <Tag size={'sm'} colorScheme='red' variant={"outline"}>
                                      <TagLabel>
                                      Response {index + 1}: 
                                      </TagLabel>
                                </Tag>
                                <Text noOfLines={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} fontSize={20}>
                                  {questionAnswer.answer}
                                </Text>
                              </Box>
                        </Box>
                      )})}
                      {(loading) ? <Progress size='lg' isIndeterminate/> : ''}
                  </Box>
                
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
                  isLoading={loading}
                  rightIcon={<HiChevronDoubleRight/>}
                  type='submit'
                  height='5vh'
                  id='link'
                  bg={buttonColor}
                  onClick={() => {
                    setChatOpen(false)
                  }}
                  >
                  Enter
                </Button>
              </HStack>
            </Box>
          </VStack>

        </HStack>
      )}
    </Formik>
  )
}

export default Chat;