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

  const [resource, setResource] = useState('Internal')

  const resources = ['Internal', 'External']

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const [searchOpen, setSearchOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [frameOpen, setFrameOpen] =useState(false)

  const [frame, setFrame] = useState('initial')
  const barColor = useColorModeValue('#F4F7FF','#101720')
  
  const buttonColor = useColorModeValue('#F4F7FF','#101720')
  const textColor = useColorModeValue('black','white')

  const {env} = useContext(EnvContext)
  const {setEnv} = useContext(EnvContext)

  useEffect(() => {
    if(env.searchHistoryDocs){
      setDocs(env.searchHistoryDocs)
      setGoogleRes(env.searchHistoryGoogleDocs)
      if(env.searchHistoryDocs.length == 0 && env.searchHistoryGoogleDocs.length == 0){
        setSearchOpen(false)
      }else{
        setSearchOpen(true)
      }
    }else{
      setSearchOpen(true)
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
    if (values.documentBuilder.trim() == "") {
      onOpen();
      return;
    }
  
    const currentPosition = env.documentBuildContents.length

    const documentEntry = [{
      id: currentPosition, 
      entry: values.documentBuilder, 
      author: values.documentAuthor,
      link: values.documentLink
    }]

    const updatedDocumentBuildContents = [...env.documentBuildContents, documentEntry];

    const vals = {
      llamaEnvironment: env.llamaEnvironment, 
      llamaTargetAddress: env.llamaTargetAddress, 
      llamaPortNumber: env.llamaPortNumber,
      solrEnvironment: env.solrEnvironment, 
      solrTargetAddress: env.solrTargetAddress, 
      solrPortNumber: env.solrPortNumber,
      chatHistory: env.chatHistory,
      searchHistoryDocs: env.searchHistoryDocs,
      searchHistoryGoogleDocs: env.searchHistoryGoogleDocs,
      documentBuildContents: updatedDocumentBuildContents,
      currentDocument: env.currentDocument
    };
    changeEnvironment(vals)
  };

  const getResponse = async (vals) => { 
    setLoading(true)
    setSearchOpen(false)
    const url = 'http://localhost:4000/searchSolr?q=' + vals
    console.log(url)
    await axios({
      method: 'post',
      url: url,
      headers: {
        'content-type': 'application/json',
      },
      data: {
        question: vals,
        env: env
      }
    })
    .then(data => {
      return data.data
    })
    .then(data => {
      setDocs(data.solrResult)
      setGoogleRes(data.googleResult)
      setLoading(false)
      setSearchOpen(true)

      const vals = ({
        llamaEnvironment: env.llamaEnvironment, 
        llamaTargetAddress: env.llamaTargetAddress, 
        llamaPortNumber: env.llamaPortNumber,
        solrEnvironment: env.solrEnvironment, 
        solrTargetAddress: env.solrTargetAddress, 
        solrPortNumber: env.solrPortNumber,
        chatHistory: env.chatHistory,
        searchHistoryDocs: data.solrResult,
        searchHistoryGoogleDocs: data.googleResult,
        documentBuildContents: env.documentBuildContents,
        currentDocument: env.currentDocument
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
            <Button 
            bg={buttonColor}
            h='6vh'
            onClick={() => {
              setSearchOpen(false)
              const vals = ({
                llamaEnvironment: env.llamaEnvironment, 
                llamaTargetAddress: env.llamaTargetAddress, 
                llamaPortNumber: env.llamaPortNumber,
                solrEnvironment: env.solrEnvironment, 
                solrTargetAddress: env.solrTargetAddress, 
                solrPortNumber: env.solrPortNumber,
                chatHistory: env.chatHistory,
                searchHistoryDocs: [],
                searchHistoryGoogleDocs: [],
                documentBuildContents: env.documentBuildContents,
                currentDocument: env.currentDocument
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
                h='6vh'
                mt='-1vh'
                borderColor="black"
                mr='-1vw'
              />
              <IconButton 
              type='submit' 
              align='center'
              isLoading={loading}
              aria-label='Search database' 
              icon={<SearchIcon />}
              bg={buttonColor}
              onClick={() => {
                setFrame(-1)
              }} 
              w='5vw'
              h='6vh'
              />
            </HStack>
            
            <Box 
            w='90%' 
            mt='2vh'
            whiteSpace="wrap"
            overflowY="auto">
            {(loading)? <Progress size='lg' isIndeterminate/> :  
              <Box 
              w='100%'>
                {searchOpen &&
                <Card opacity={docs === null ? 0 : 1}>
                  <HStack padding={1} bg={barColor} rounded={5} >
                    <Tabs 
                    alignItems={'center'} 
                    variant='enclosed'
                    defaultIndex={resource == 'Internal' ? 0 : 1}>
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
                  
                  <Card
                  w='100%'>
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
                                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'Segoe UI', fontSize:'14px' }}
                                    dangerouslySetInnerHTML={{__html: doc.content.toString().replace(/<em>(.*?)<\/em>/g, '<strong><u>$1</u></strong>')}} />
                                  </Text>
                                </VStack>
                                <VStack align='right'>
                                  <Button w='5vw'
                                  bg={buttonColor}
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
                                    <Button 
                                    w='5vw'
                                    bg={buttonColor}
                                    >
                                      Visit
                                    </Button>
                                  </Link>

                                  <Button w='5vw'
                                  bg={buttonColor}
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
                                  bg={buttonColor}
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
                </Card>}
              </Box>}
            </Box>
          </VStack>
        </HStack>)}
    </Formik>
  );
};

export default Search