import React, { useEffect } from "react";
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
        console.log(questionAnswer)
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

          {/* User Question and Llama Answer*/}
          <VStack w='100vw'>
              <HStack 
              align={'center'}
              h='100%' 
              w='100%' 
              overflowX="auto"
              whiteSpace="wrap"
              overflowY="auto">
                <VStack h='85vh' w='75vw' ml='7vw'>
                  {questionAnswer.map((questionAnswer, index) => {
                    const isLastItem = index === chatLength ;
                    return (
                        <VStack 
                        key={index} >
                          <HStack w='75vw' align={'center'}>
                            <VStack 
                            w={'100%'}
                            h='9vh'
                            align={'right'} 
                            border='2px' 
                            rounded={10} 
                            padding={3} 
                            borderColor={"#676e79"}>
                                <Box align={'right'}>
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
                                </Box>
                                <Text fontSize={20} align={'right'}>
                                {questionAnswer.Question}
                                </Text>
                              </VStack>
                              <Avatar bg='lightblue' showBorder icon={<AiOutlineUser/>}/>
                            </HStack>
                            <Box w='75vw'>

                            <ScaleFade initialScale={0.5} in={!isLastItem}>
                              <HStack align={'center'}>
                              <Avatar  src={Llama} bg='white'/>
                                <VStack 
                                align={'left'} 
                                border='2px'  
                                rounded={10} 
                                padding={3}
                                borderColor={"#676e79"}
                                width={'75vw'}>
                                  <Box align='left'>
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
                            </ScaleFade>
                            </Box>
                        </VStack>)})}

                  {/* Skeleton Loading */}
                  <VStack w='100%'>
                  <Collapse in={loading}>
                  {loading &&
                    <VStack width={'75vw'}>
                      <HStack w='100%' align={'center'}>
                        <Skeleton 
                        color='white'
                        w='100%'
                        isLoaded={!chatOpen}>
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
                            ml='3px'
                            mb='3'>
                                <TagLabel>
                                  Question {chatLength + 1}
                                </TagLabel>
                            </Tag>
                            <Text fontSize={20} align={'right'}>
                            {currentQuestion}
                            </Text>
                          </Box>
                        </Skeleton>
                          <Avatar bg='lightblue' showBorder icon={<AiOutlineUser/>}/>
                        </HStack>
                      <VStack 
                      align={'left'} 
                      width={'75vw'}>
                        <HStack>  
                          <SkeletonCircle size='12' />
                          <Skeleton 
                          color='white'
                          isLoaded={chatOpen}
                          w='100%'>
                            <Box 
                            padding={3} >
                              .
                            </Box>
                          </Skeleton>
                        </HStack>    
                      </VStack>
                    </VStack>}
                  </Collapse>
                  </VStack>
                  
              </VStack>
            </HStack>

            {/* Input Elements */}
            <Box mt='1vh'>
              <HStack>
                <TextField
                  name='question'
                  placeholder={"Question goes here"}
                  autoComplete="off"
                  width='70vw'
                  h='5vh'
                  borderColor="black"
                  mb='1vh'
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