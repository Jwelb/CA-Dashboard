import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from 'formik'
import * as Yup from "yup";
import { HStack, VStack, Progress, Text, Box, Button, Card, Stack, StackDivider, CardBody, Tabs, Tab, TabList, Fade, IconButton, Collapse } from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons'
import { useDisclosure } from "@chakra-ui/react";
import { useState } from 'react';
import axios from 'axios'
import TextField from "../components/TextField";
import { EnvContext } from '../components/envContext';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Link,
  useColorModeValue
} from '@chakra-ui/react'

function Search() {

  const [docs, setDocs] = useState([])
  const [googleRes, setGoogleRes] = useState([])

  const [resource, setResource] = useState('Internal')

  const resources = ['Internal', 'External']

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const [searchOpen, setSearchOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [frameOpen, setFrameOpen] =useState(false)

  const [frame, setFrame] = useState('initial')
  const barColor = useColorModeValue('#F4F7FF','#101720')

  const {env} = useContext(EnvContext)
  const {setEnv} = useContext(EnvContext)

  useEffect(() => {
    if(env.searchHistoryDocs){
      setDocs(env.searchHistoryDocs)
      setGoogleRes(env.searchHistoryGoogleDocs)
      if(env.searchHistoryDocs.length == 0){
        setSearchOpen(false)
      }else{
        setSearchOpen(true)
      }
    }else{
      setSearchOpen(false)
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

  const getResponse = async (vals) => { 
    setLoading(true)
    const url = 'http://localhost:4000/searchSolr?q=' + vals
    await axios({
      method: 'get',
      url: url,
      headers: {
        'content-type': 'application/json',
      }
    })
    .then(data => {
      return data.data
    })
    .then(data => {
      console.log(data.solrResult)
      console.log(data.googleResult)
      setDocs(data.solrResult.docs)
      setGoogleRes(data.googleResult)
      setLoading(false)
      setSearchOpen(true)

      const vals = ({
        environment: env.environment,
        targetAddress: env.targetAddress,
        portNumber: env.portNumber,
        chatHistory: env.chatHistory,
        searchHistoryDocs: data.solrResult.docs,
        searchHistoryGoogleDocs: data.googleResult
      })
      changeEnvironment(vals)
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
        const vals = { ...values };
        getResponse(vals.question)
        actions.resetForm()
      }}
    >

      {(formik) => (
        <HStack
          w="100%"
          h='100%'
          as={Form}>

          {Navbar()}

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
                  Please enter a search!
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Roger that.
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          <VStack height='97vh' w='100vw'>
            <HStack mt='2vh' align={'center'}>
            <Button mt='1vh'
            onClick={() => {
              setSearchOpen(false)
              const vals = ({
                environment: env.environment,
                targetAddress: env.targetAddress,
                portNumber: env.portNumber,
                chatHistory: env.chatHistory,
                searchHistoryDocs: [],
                searchHistoryGoogleDocs: []
              })
              changeEnvironment(vals)
            }}>
                Clear History
              </Button>
              <TextField
                name='question'
                placeholder={"Search Query goes here"}
                autoComplete="off"
                width='70vw'
                height='5vh'
                borderColor="black"
                mr='-1vw'
              />
              <IconButton 
              mt='1vh'
              type='submit' 
              align='center'
              isLoading={loading}
              aria-label='Search database' 
              icon={<SearchIcon />}
              onClick={() => {
                setSearchOpen(false)
              }} 
              h='4vh'
              w='4vw'
              />
            </HStack>
            
            <Box w='80vw' mt='2vh'
            overflowX="auto"
            whiteSpace="wrap"
            overflowY="auto">
            {(loading) ?  <Progress size='lg' isIndeterminate/> : '' } 
            <Collapse in={searchOpen} animateOpacity>
              <Box w='80vw'>
                <Card opacity={docs === 'initial' ? 0 : 1}>
                  <HStack padding={1} bg={barColor} rounded={5} >
                    <Tabs alignItems={'center'}>
                      <TabList alignItems={'center'}>
                        {resources.map((item, index) => {
                          return(
                            <Tab 
                            id='link'
                            key={index}
                            onClick={() => {
                              setResource(item)
                              setFrame(-1)
                            }}>
                              <Text size='sm'>{item}</Text>
                            </Tab>
                          )
                        })}
                      </TabList>
                    </Tabs>
                  </HStack>
                  
                  <Card>
                    <Stack divider={<StackDivider />} spacing='.3'>
                      {resource=='Internal' && docs.map((doc, index) => {
                        return (
                          <HStack key={index}>
                            <CardBody>
                              <VStack w={'100%'}>
                              <HStack w={'100%'}>
                                <VStack w='100%' align={'left'}>
                                  <Text size='sm' fontWeight='bold'>
                                  {doc.title || 'No title Found'}  - {doc.author}
                                  </Text>
                                  <Text pt='15px' fontSize='md'>
                                  ...
                                  </Text>
                                </VStack>
                                <VStack align='right'>
                                  <Button w='5vw'
                                  onClick={()=> {
                                    setFrame(index)
                                  }}>
                                    Preview
                                  </Button>
                                </VStack>
                              </HStack>
                              </VStack>
                            </CardBody>
                        </HStack>
                        )})}
                      {resource=='External' && googleRes.map((doc, index) => {
                        return (
                          <HStack key={index}>
                            <CardBody>
                              <VStack w={'100%'}>
                              <HStack w={'100%'}>
                                <VStack w='100%' align={'left'}>
                                  <Text size='sm' fontWeight='bold'>
                                  {doc.title || 'No title Found'} 
                                  </Text>
                                  <Text pt='15px' fontSize='md'>
                                  {doc.snippet}
                                  </Text>
                                </VStack>
                                <VStack align='right'>
                                  
                                  <Link href={doc.formattedUrl} isExternal>
                                    <Button w='5vw'>
                                      Visit
                                    </Button>
                                  </Link>

                                  <Button w='5vw'
                                  onClick={()=> {
                                    if(frame != index){
                                      setFrame(index)
                                      setFrameOpen(true)
                                    }else{
                                      setFrame(-1)
                                      setFrameOpen(false)
                                    }
                                  }}>
                                    Preview
                                  </Button>
                                </VStack>
                              </HStack>
                              <Box w='100%'>
                              <Collapse in={frameOpen} animateOpacity>
                                {index == frame && 
                                  <HStack w='100%'>
                                  <iframe
                                    src={doc.formattedUrl}
                                    width="100%"
                                    height="400vh"
                                    title="Website Preview"
                                  />
                                  <Button>
                                    Transfer
                                  </Button>
                                  <iframe
                                    src={doc.formattedUrl}
                                    width="100%"
                                    height="400vh"
                                    title="Website Preview"
                                  />
                                  </HStack>
                                }
                                </Collapse>
                                </Box>
                              </VStack>
                            </CardBody>
                        </HStack>
                        
                      )})}
                    </Stack>
                  </Card>
                </Card>
              </Box>
            </Collapse>
            </Box>
          </VStack>
        </HStack>)}
    </Formik>
  );
};

export default Search