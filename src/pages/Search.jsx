import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from 'formik'
import * as Yup from "yup";
import { HStack, VStack, Progress, Text, Box, Button, Card, Stack, StackDivider, CardBody, Tabs, Tab, TabList, Fade, IconButton, Collapse, Textarea } from "@chakra-ui/react";
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
  const [innerFormValues, setInnerFormValues] = useState({ documentBuilder: "", documentAuthor: ""});

  const [resource, setResource] = useState(null)

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
    console.log(env)
    if(env.searchHistoryDocs){
      setDocs(env.searchHistoryDocs)
      setGoogleRes(env.searchHistoryGoogleDocs)
      if(env.searchHistoryDocs.length == 0 && env.searchHistoryGoogleDocs.length == 0){
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

  const handleDocumentSubmit = (values, actions) => {
    console.log(values)
    if (values.documentBuilder.trim() == "") {
      onOpen();
      return;
    }
  
    const currentPosition = env.documentBuildContents.length
    console.log(currentPosition)

    const documentEntry = [{
      id: currentPosition, 
      entry: values.documentBuilder, 
      author: values.documentAuthor,
      link: values.documentLink
    }]

    const updatedDocumentBuildContents = [...env.documentBuildContents, documentEntry];

    const vals = {
      environment: env.environment,
      targetAddress: env.targetAddress,
      portNumber: env.portNumber,
      chatHistory: env.chatHistory,
      searchHistoryDocs: env.searchHistoryDocs,
      searchHistoryGoogleDocs: env.searchHistoryGoogleDocs,
      documentBuildContents: updatedDocumentBuildContents // something
    };
    changeEnvironment(vals)
  };

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
        searchHistoryGoogleDocs: data.googleResult,
        documentBuildContents: env.documentBuildContents
      })
      changeEnvironment(vals)
    })
  }

  return (
    <Formik
      initialValues={{ question: '' }}
      validationSchema={Yup.object({ question: Yup.string() })}
      onSubmit={(values, actions) => {
        if (values.question.trim() == "" && innerFormValues.documentBuilder == "") {
          {onOpen()}
          return
        }
        if(values.question.trim() != ""){
          setSearchOpen(false)
          const vals = { ...values };
          getResponse(vals.question)
          actions.resetForm()
        }
        setInnerFormValues({ documentBuilder: "", documentAuthor: "", documentLink: "" });
      }}
    >

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
                searchHistoryGoogleDocs: [],
                documentBuildContents: env.documentBuildContents
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
                setFrame(-1)
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
                                  <VStack w='100%'>
                                  <iframe
                                    src={doc.formattedUrl}
                                    width="100%"
                                    height="400vh"
                                    title="Website Preview"
                                  />
                                  <HStack width='100%'>
                                  <Textarea
                                  name='documentBuilder'
                                  value={innerFormValues.documentBuilder}
                                  placeholder={"Information to send to document"}
                                  autoComplete="off"
                                  minH="100px"
                                  borderColor="black"
                                  resize="none"  
                                  overflowY="hidden"
                                  onChange={(e) => {
                                    setInnerFormValues({ 
                                      documentBuilder: e.target.value, 
                                      documentAuthor: doc.displayLink, 
                                      documentLink: doc.link
                                    })
                                  }}
                                />
                                  <Button
                                  type="submit"
                                  h='100%'
                                  padding={3}
                                  onClick={() => {
                                    handleDocumentSubmit(innerFormValues)
                                  }}>
                                    <VStack>
                                      <Text>Send to</Text>
                                      <Text>Document</Text>
                                    </VStack>
                                  </Button>
                                  </HStack>
                                  </VStack>
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