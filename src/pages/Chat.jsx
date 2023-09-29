import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from 'formik'
import * as Yup from "yup";
import { HStack, VStack, Text, Box, Button, Progress, ScaleFade, useColorModeValue, Collapse, Skeleton } from "@chakra-ui/react";
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
  const [currentQuestion, setQuestion] = useState()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const [loading, setLoading] = useState(false)

  const buttonColor = useColorModeValue('#F4F7FF','#101720')

  const [chatOpen, setChatOpen] = useState(false)

  const [chatLength, setChatLength] = useState(1) ;

  useEffect(() => {
    setChatLength(questionAnswer.length)
  }, [questionAnswer])


  const getAnswer = async (vals) => {
    const currentIndex = questionAnswer.length; 
    const updatedAnswers = [...questionAnswer, { Question: vals, answer: null }];
    setLoading(true)
    await axios({
      method: 'post',
      url: 'http://localhost:4000/chatQuery',
      headers: {
        'content-type': 'application/json',
      },
      data: {
        question: vals
      }
    }).then(data => {
        updatedAnswers[currentIndex].answer = data.data;
        setQuestionAnswer(updatedAnswers); 
        setChatOpen(true)
        setLoading(false)
        setChatLength(questionAnswer.length)
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
        setQuestion(values.question)
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
                    const isLastItem = index === chatLength ;
                    return (
                      <Box mb='1vh' mt='1vh' key={index}>
                        <Box mb='1vh' mt='1vh'>
                          <Box 
                          mb='1vh' 
                          align={'right'} 
                          bg='' 
                          border='2px' 
                          rounded={10} 
                          padding={3} 
                          borderColor={"#676e79"}>
                            <Tag 
                            size={'sm'} 
                            colorScheme='teal' 
                            variant={"outline"}>
                                <TagLabel>
                                Question {index + 1}: 
                                </TagLabel>
                            </Tag>
                            <Text fontSize={20}>
                            {questionAnswer.Question}
                            </Text>
                          </Box>
                          <ScaleFade initialScale={0.4} in={!isLastItem}>
                          <Box 
                          mb='1vh' 
                          mt='1vh' 
                          align={'left'} 
                          border='2px'  
                          rounded={10} 
                          padding={3}
                          borderColor={"#676e79"}>
                            <Tag size={'sm'} colorScheme='red' variant={"outline"}>
                                  <TagLabel>
                                  Response {index + 1}: 
                                  </TagLabel>
                            </Tag>
                            <Text  fontSize={20}>
                              {questionAnswer.answer}
                            </Text>
                          </Box>
                          </ScaleFade>
                        </Box>
                      </Box>
                    )})}

                    <Box mb='1vh' mt='1vh'>
                      <Collapse in={loading}>
                          {loading &&
                          <Box mb='1vh'>
                            <Skeleton 
                            color='white'
                            isLoaded={!chatOpen}>
                              <Box 
                              mb='1vh' 
                              align={'right'} 
                              bg='' 
                              border='2px' 
                              rounded={10} 
                              padding={3} 
                              borderColor={"#676e79"}>
                                <Tag 
                                size={'sm'} 
                                colorScheme='teal' 
                                variant={"outline"}>
                                    <TagLabel>
                                    Question {chatLength + 1}: 
                                    </TagLabel>
                                </Tag>
                                <Text fontSize={20}>
                                {currentQuestion}
                                </Text>
                              </Box>
                            </Skeleton>
                                  
                            <Skeleton 
                            color='white'
                            isLoaded={chatOpen}>
                              <Box 
                              mb='1vh' 
                              mt='1vh' 
                              padding={3} >
                                .
                              </Box>
                            </Skeleton>
                          </Box>}
                      </Collapse>
                  </Box>

                </Box>
              </Box>

            </HStack>

            <Box mt='1vh'>
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