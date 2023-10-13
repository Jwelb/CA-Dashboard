import React from "react";
import Navbar from "../components/Navbar";
import { Formik, Form } from 'formik'
import * as Yup from "yup";
import { HStack, VStack, Progress, Text, Box, Button, Card, Stack, StackDivider, CardBody, Tabs, Tab, TabList, Fade, IconButton, Collapse } from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons'
import { useDisclosure } from "@chakra-ui/react";
import { useState } from 'react';
import axios from 'axios'
import TextField from "../components/TextField";
import SolrConnector from 'react-solr-connector';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'

function Search() {

  const [docs, setDocs] = useState([])
  const [length, setLength] = useState(0)

  const [resource, setResource] = useState('Internal')

  const resources = ['Internal', 'Google', 'Wikipedia']

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const [searchOpen, setSearchOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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
      console.log(data)
      setLength(data.numFound)
      setDocs(data.docs)
      setLoading(false)
      setSearchOpen(true)
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
          as={Form}>

          <VStack>
            {Navbar()}
          </VStack>

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

          <VStack height='100vh' w='100vw'>

            <HStack mt='5vh'>
              <TextField
                name='question'
                placeholder={"Search Query goes here"}
                autoComplete="off"
                width='70vw'
                height='5vh'
                borderColor="black"
              />
              <IconButton 
              type='submit' 
              isLoading={loading}
              aria-label='Search database' 
              icon={<SearchIcon />}
              onClick={() => {
                setSearchOpen(false)
              }} 
              />
            </HStack>
            
            <Box w='80vw' mt='5vh'
            overflowX="auto"
            whiteSpace="wrap"
            overflowY="auto">
            {(loading) ?  <Progress size='lg' isIndeterminate/> : '' } 
            <Collapse in={searchOpen} animateOpacity>
              <Box mt='5vh' w='80vw'>
                <Card opacity={docs === 'initial' ? 0 : 1}>
                  <HStack padding={1}>
                    <Tabs alignItems={'center'}>
                      <TabList alignItems={'center'}>
                        {resources.map((item, index) => {
                          return(
                            <Tab 
                            id='link'
                            key={index}
                            onClick={() => {
                              setResource(item)
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
                      {docs.map((doc, index) => {
                        return (
                          <HStack key={index}>
                            <CardBody>
                              <Text size='sm' fontWeight='bold'>
                              {doc.title || 'No title Found'} - {doc.author || ''} 
                              </Text>
                              <Text pt='1' fontSize='sm'>
                                ...
                              </Text>
                            </CardBody>
                        </HStack>
                        )
                      })}
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