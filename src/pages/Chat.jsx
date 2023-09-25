import React from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from 'formik'
import * as Yup from "yup";
import { HStack, VStack, Text, Box, Button, Divider, Progress } from "@chakra-ui/react";
import { useState, setState } from 'react';
import TextField from "../components/TextField";
import axios from 'axios'
import { useEffect } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tag,
  TagLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'

import { HiChevronDoubleRight } from "react-icons/hi2";

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
      initialValues={{ question: '' }}
      validationSchema={Yup.object({ question: Yup.string() })}
      onSubmit={(values, actions) => {
        if (values.question.trim() == "") {
          { onOpen() }
          return
        }
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

                      {(loading) ? <Progress size='lg' isIndeterminate /> : null}
                      
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
                  id='link'>
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