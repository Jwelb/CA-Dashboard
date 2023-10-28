import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from 'formik'
import * as Yup from "yup";
import { useState } from 'react';
import TextField from "../components/TextField";
import axios from 'axios'
import { CheckIcon, SmallCloseIcon  } from '@chakra-ui/icons'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tag,
  TagLabel,
  useDisclosure,
  SkeletonCircle,
  HStack, 
  VStack, 
  Text, 
  Box, 
  Button, 
  ScaleFade, 
  useColorModeValue, 
  Collapse, 
  Skeleton, 
  Tooltip, 
  Avatar
} from '@chakra-ui/react'
import { AiOutlineUser } from 'react-icons/ai'
import { HiChevronDoubleRight } from "react-icons/hi2";
import  Llama  from '../components/icons/llama.png'
import { EnvContext } from '../components/envContext';

const Chat = () => {

  const [questionAnswer, setQuestionAnswer] = useState([])
  const [currentQuestion, setQuestion] = useState()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const [loading, setLoading] = useState(false)

  const buttonColor = useColorModeValue('#F4F7FF','#101720')
  const textColor = useColorModeValue('black','white')

  const [chatOpen, setChatOpen] = useState(false)

  const [chatLength, setChatLength] = useState(1) ;

  const {env} = useContext(EnvContext)
  const {setEnv} = useContext(EnvContext)


  useEffect(() => {
      if(env.chatHistory){
        setChatLength(env.chatHistory.length)
        setQuestionAnswer(env.chatHistory)
      }else{
        setChatLength(1)
      }
    }, [env])

  const changeEnvironment = async (vals) => {
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
        question: vals,
        environment: env
      }
    }).then(data => {
        updatedAnswers[currentIndex].answer = data.data;
        setQuestionAnswer(updatedAnswers); 
        setChatOpen(true)
        setLoading(false)
        setChatLength(questionAnswer.length)

        const vals = ({
          environment: env.environment,
          targetAddress: env.targetAddress,
          portNumber: env.portNumber,
          chatHistory: updatedAnswers,
          searchHistoryDocs: env.searchHistoryDocs,
          searchHistoryGoogleDocs: env.searchHistoryGoogleDocs,
          documentBuildContents: env.documentBuildContents,
          currentDocument: env.currentDocument
        })
        changeEnvironment(vals)
      })
  }

  const getFeedback = async (vals) => {
    console.log(vals)
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
          w="100vw"
          h='100vh'
          as={Form}>
            
          <Box>{Navbar()}</Box>

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

          {/* User Question and Llama Answer*/}
          <VStack w='100vw'>
              <HStack 
              align={'center'}
              h='100%' 
              w='100%' 
              overflowX="auto"
              whiteSpace="wrap"
              overflowY="auto">
                <VStack h='85vh' w='75vw' ml='7vw' align={'center'}>
                  {questionAnswer.map((questionAnswer, index) => {
                    const isLastItem = index === chatLength ;
                    return (
                        <VStack 
                        key={index} 
                        w='75vw'
                        align={'center'}>
                            <HStack w='75vw' align={'center'}>
                              <HStack w='75vw' align={'center'} ml='1'>
                              <VStack 
                              w={'75vw'}
                              align={'center'} 
                              border='2px' 
                              rounded={10} 
                              padding={3} 
                              borderColor={"#676e79"}>
                                  <Box align={'right'} w='100%'>
                                    <Tooltip label="Query #">
                                      <Tag 
                                      size={'sm'} 
                                      colorScheme='teal' 
                                      variant={"outline"}
                                      h='2vh'
                                      mr='3px'
                                      ml='3px'>
                                          <TagLabel>
                                            Question {index + 1}
                                          </TagLabel>
                                      </Tag>
                                    </Tooltip>
                                    <Text fontSize={20} align={'right'}>
                                  {questionAnswer.Question}
                                  </Text>
                                  </Box>
                                </VStack>
                                </HStack>

                                <Box>
                                  <Avatar bg='lightblue' showBorder icon={<AiOutlineUser/>}/>
                                </Box>
                                </HStack>
                            
                            <ScaleFade initialScale={.7} in={!isLastItem}>
                            <HStack align={'center'}>
                            <Box>
                              <Avatar src={Llama} bg='white' ml='-3vw'/>
                            </Box>
                            <Box w='75vw' align={'center'}>
                              <HStack w='75vw'>
                                <HStack align={'center'} w='100%'>
                                  <VStack 
                                  align={'left'} 
                                  width={'75vw'}>
                                    <Box 
                                    align='left'
                                    border='2px'  
                                    rounded={10} 
                                    padding={3}
                                    borderColor={"#676e79"}>
                                        <HStack>
                                          <Tooltip label="Good Result">
                                          <Tag 
                                          as={'button'}
                                          type="button"
                                          size={'sm'} 
                                          colorScheme='green' 
                                          variant={"outline"}
                                          h='2vh'
                                          mb='2'
                                          onClick={() => {
                                            getFeedback('Like')
                                          }}
                                          padding={3}>
                                              <TagLabel>
                                                <CheckIcon/>
                                              </TagLabel>
                                          </Tag>
                                        </Tooltip>
                                        <Tooltip label="Negative Result">
                                          <Tag 
                                          as={'button'}
                                          type="button"
                                          size={'sm'} 
                                          colorScheme='red' 
                                          variant={"outline"}
                                          h='2vh'
                                          mb='2'
                                          onClick={() => {
                                            getFeedback('Dislike')
                                          }}
                                          padding={3}>
                                            <TagLabel>
                                              <SmallCloseIcon/>
                                            </TagLabel>
                                          </Tag>
                                        </Tooltip>
                                      </HStack>
                                        <Text fontSize={20}>
                                          {questionAnswer.answer}
                                        </Text>
                                    </Box>
                                  </VStack>
                                </HStack>
                              </HStack>
                            </Box>
                            </HStack>
                            </ScaleFade>
                        </VStack>)})}

                  {/* Skeleton Loading */}
                  <VStack w='85vw' ml={1}>
                  <Collapse in={loading}>
                  {loading &&
                    <VStack width={'85vw'} align='center' ml={1}>
                      <HStack w='75vw'>
                        <HStack w='100%' align={'center'}>
                          <Skeleton 
                          color='white'
                          w='100%'
                          isLoaded={!chatOpen}
                          rounded={10}>
                            <HStack w='75vw'>
                              <Box 
                              align={'right'} 
                              w='100%'
                              border='2px' 
                              rounded={10} 
                              padding={3} 
                              borderColor={"#676e79"}>
                                <Tag 
                                size={'sm'} 
                                colorScheme='teal' 
                                variant={"outline"}
                                h='2vh'
                                mr='3px'
                                ml='3px'>
                                    <TagLabel>
                                      Question {chatLength + 1}
                                    </TagLabel>
                                </Tag>
                                <Text fontSize={20} align={'right'} color={textColor}>
                                {currentQuestion}
                                </Text>
                              </Box>
                            </HStack>
                          </Skeleton>
                        </HStack>
                      <Box>
                          <Avatar bg='lightblue' showBorder icon={<AiOutlineUser/>}/>
                      </Box>
                      </HStack>

                      <HStack w='85vw' ml={1}>
                      <Box w='5vw' align='center'>
                          <SkeletonCircle size='12' />
                      </Box>
                      <HStack w='75vw' ml={-2}>  
                        <HStack w='100%'>
                              <Skeleton 
                              color='white'
                              isLoaded={chatOpen}
                              w='100%'
                              rounded={10}
                              align='center'>
                              <Box 
                              padding={3} 
                              h='9vh'
                              rounded={10}>
                              </Box>
                              </Skeleton>
                          </HStack> 
                        </HStack>
                      </HStack>
                    </VStack>}
                  </Collapse>
                  </VStack>
                  
              </VStack>
            </HStack>

            {/* Input Elements */}
            <Box mt='1vh'>
              <HStack>
              <Button
                  isLoading={loading}
                  height='6vh'
                  id='link'
                  bg={buttonColor}
                  mt='1vh'
                  onClick={() => {
                    setChatOpen(false)
                    const vals = ({
                      environment: env.environment,
                      targetAddress: env.targetAddress,
                      portNumber: env.portNumber,
                      chatHistory: [],
                      searchHistoryDocs: env.searchHistoryDocs,
                      searchHistoryGoogleDocs: env.searchHistoryGoogleDocs,
                      documentBuildContents: env.documentBuildContents,
                      currentDocument: env.currentDocument
                    })
                    changeEnvironment(vals)
                    }}
                  >
                  Clear History
                </Button>
                <TextField
                  name='question'
                  placeholder={"Question goes here"}
                  autoComplete="off"
                  width='70vw'
                  h='6vh'
                  borderColor="black"
                  mr='-1vw'
                />
                <Button
                  isLoading={loading}
                  rightIcon={<HiChevronDoubleRight/>}
                  type='submit'
                  height='6vh'
                  id='link'
                  mt='1vh'
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