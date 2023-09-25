import React from "react";
import Navbar from "../components/Navbar";
import { Field, Formik, Form } from 'formik'
import * as Yup from "yup";
import { HStack, VStack, Input, Text, Box, Button, Card, CardHeader, Heading, Stack, StackDivider, CardBody, Tabs, Tab, TabList, Center, IconButton, Flex } from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons'
import { useDisclosure } from "@chakra-ui/react";
import { useState } from 'react';
import TextField from "../components/TextField";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'

function Search() {

  const [answer, setAnswer] = useState('initial')
  const [resource, setResource] = useState('Internal')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const getResponse = ({ ...props }) => {
    setAnswer(props.question)
    console.log(props.question)
    // Need to connect to back-end
  }
  /*initialValues={{ question: '' }}
        validationSchema={Yup.object({
          question: Yup.string().required("Please enter a question")
        })}
        onSubmit={(values, actions) => {
          const vals = { ...values };
          //console.log(vals)
          getResponse(vals)
          actions.resetForm()
        }}
  */
  return (
    <Formik
      initialValues={{ question: '' }}
      validationSchema={Yup.object({ question: Yup.string() })}
      onSubmit={(values, actions) => {
        if (values.question.trim() == "") {
          { onOpen() }
          return
        }
        const vals = { ...values };
        getResponse(vals)
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
                    Roger that, batman.
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>


          </AlertDialog>

          <Flex alignItems='center' justifyContent="center" mb='93vh'>

            <TextField
              name='question'
              placeholder={"Search Query goes here"}
              autoComplete="off"
              width='70vw'
              height='5vh'
              borderColor="black"
            />
            <IconButton type='submit' aria-label='Search database' icon={<SearchIcon />} />
          </Flex>
          <Flex h='50vh' w='50vw' bg='grey' alignItems='center' justifyContent='center'>
            <Card opacity={answer === 'initial' ? 0 : 1}>
              <HStack padding={1}>
                <Tabs>
                  <TabList>
                    <Tab id='link'
                      onClick={() => {
                        setResource('Internal')
                      }}>
                      <Text size='sm'>Internal Resource</Text>
                    </Tab>
                    <Tab id='link'
                      onClick={() => {
                        setResource('Google')
                      }}>
                      <Text size='sm'>Google Resource</Text>
                    </Tab>
                    <Tab id='link'
                      onClick={() => {
                        setResource('Wikipedia')
                      }}>
                      <Text size='sm'>Wikipedia Resource</Text>
                    </Tab>
                  </TabList>
                </Tabs>
              </HStack>

              <Card>
                <Stack divider={<StackDivider />} spacing='.3'>
                  <HStack>
                    <CardBody>
                      <Text size='xs' fontWeight='bold'>
                        {answer} article 1 from {resource}
                      </Text>
                      <Text pt='1' fontSize='sm'>
                        ...
                      </Text>
                    </CardBody>
                  </HStack>
                  <HStack>
                    <CardBody>
                      <Text size='xs' fontWeight='bold'>
                        {answer} article 1 from {resource}
                      </Text>
                      <Text pt='1' fontSize='sm'>
                        ...
                      </Text>
                    </CardBody>
                  </HStack>
                  <HStack>
                    <CardBody>
                      <Text size='xs' fontWeight='bold'>
                        {answer} article 1 from {resource}
                      </Text>
                      <Text pt='1' fontSize='sm'>
                        ...
                      </Text>
                    </CardBody>
                  </HStack>
                  <HStack>
                    <CardBody>
                      <Text size='xs' fontWeight='bold'>
                        {answer} article 1 from {resource}
                      </Text>
                      <Text pt='1' fontSize='sm'>
                        ...
                      </Text>
                    </CardBody>
                  </HStack>
                </Stack>
              </Card>
            </Card>
          </Flex>



        </HStack>
      )}
    </Formik>
  );
};

export default Search