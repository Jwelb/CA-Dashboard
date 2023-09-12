import React from "react";
import Navbar from "../components/Navbar";
import { Field, Formik, Form } from 'formik'
import * as Yup from "yup" ;
import { HStack, VStack, Input, Text, Box, Button, Card, CardHeader, Heading, Stack, StackDivider, CardBody } from "@chakra-ui/react";
import { useState } from 'react';
import TextField from "../components/TextField";

function Search(){

  const [answer, setAnswer] = useState('initial')

  const getResponse = ({...props}) => {
      setAnswer('Request recieved')
      // Need to connect to back-end
  }

  return (
    <Formik
    initialValues = {{question: ''}}
    validationSchema = {Yup.object({
      question: Yup.string().required("Please enter a question")
    })}
    onSubmit={(values, actions) => {
      const vals = {...values} ;
      console.log(vals)
      getResponse(vals)
      actions.resetForm()
      }}
    >

      {(formik) => (
        <HStack 
        w="100%" 
        spacing={'24vw'}
        as={Form}>

        {Navbar()}
    
          <VStack spacing={50}>

            <VStack spacing={50} marginBottom='10vh'>
      
              <HStack spacing={50}>
        
                <TextField 
                  name='question'
                  placeholder={"Search Query goes here"}
                  autoComplete="off"
                  width='40vh'
                  height='5vh'
                  borderColor="black"
                />
              
                <Button 
                type='submit'
                height='3vh'>
                  Submit
                </Button>

              </HStack>

            </VStack>

            <VStack>
              <Card opacity={answer === 'initial' ? 0 : 1}>
                <HStack padding={10}>
                  <CardHeader>
                    <Button id='link'>
                    <Text size='sm'>Resource 1</Text>
                    </Button>
                  </CardHeader>
                  <CardHeader>
                  <Button id='link'>
                    <Text size='sm'>Resource 2</Text>
                    </Button>
                  </CardHeader>
                  <CardHeader>
                  <Button id='link'>
                    <Text size='sm'>Resource 3</Text>
                    </Button>
                  </CardHeader>
                  <CardHeader>
                  <Button id='link'>
                    <Text size='sm'>Resource 4</Text>
                    </Button>
                  </CardHeader>
                  <CardHeader>
                  <Button id='link'>
                    <Text size='sm'>Resource 5</Text>
                    </Button>
                  </CardHeader>
                </HStack>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='1'>
                    <HStack>
                      <Text size='sm' textTransform='uppercase' fontWeight='bold'>
                        Summary
                      </Text>
                      <Text pt='1' fontSize='sm'>
                        View a summary of all your clients over the last month.
                      </Text>
                    </HStack>
                    <HStack>
                      <Text size='xs' textTransform='uppercase' fontWeight='bold'>
                        Overview
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        Check out the overview of your clients.
                      </Text>
                    </HStack>
                    <HStack>
                      <Text size='xs' textTransform='uppercase' fontWeight='bold'>
                        Analysis
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        See a detailed analysis of all your business clients.
                      </Text>
                    </HStack>
                    <HStack>
                      <Text size='xs' textTransform='uppercase' fontWeight='bold'>
                        Analysis
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        See a detailed analysis of all your business clients.
                      </Text>
                    </HStack>
                    <HStack>
                      <Text size='xs' textTransform='uppercase' fontWeight='bold'>
                        Analysis
                      </Text>
                      <Text pt='2' fontSize='sm'>
                        See a detailed analysis of all your business clients.
                      </Text>
                    </HStack>
                  </Stack>
                </CardBody>
            </Card>
            </VStack>
        </VStack>
      </HStack>
      )}
    </Formik>
  );
};

export default Search