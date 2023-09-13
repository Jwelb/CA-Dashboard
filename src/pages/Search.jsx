import React from "react";
import Navbar from "../components/Navbar";
import { Field, Formik, Form } from 'formik'
import * as Yup from "yup" ;
import { HStack, VStack, Input, Text, Box, Button, Card, CardHeader, Heading, Stack, StackDivider, CardBody } from "@chakra-ui/react";
import { useState } from 'react';
import TextField from "../components/TextField";

function Search(){

  const [answer, setAnswer] = useState('initial')
  const [resource, setResource] = useState('Internal')

  const getResponse = ({...props}) => {
      setAnswer(props.question)
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
      //console.log(vals)
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
    
          <VStack spacing={50} id='searchCenter'>

            <VStack>
      
              <HStack spacing={20}>
        
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
                    <Button id='link'
                    bg={resource == 'Internal' ? 'red' : 'grey'}
                    onClick={() => {
                      setResource('Internal')
                    }}>
                    <Text size='sm'>Internal Resource</Text>
                    </Button>
                  </CardHeader>
                  <CardHeader>
                  <Button id='link'
                  bg={resource == 'Google' ? 'red' : 'grey'}
                  onClick={() => {
                    setResource('Google')
                  }}>
                    <Text size='sm'>Google Resource</Text>
                    </Button>
                  </CardHeader>
                  <CardHeader>
                  <Button id='link'
                  bg={resource == 'Wikipedia' ? 'red' : 'grey'}
                  onClick={() => {
                    setResource('Wikipedia')
                  }}>
                    <Text size='sm'>Wikipedia Resource</Text>
                    </Button>
                  </CardHeader>
                </HStack>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='.3'>
                    <HStack>
                      <Text size='xs' fontWeight='bold'>
                        {answer} article 1 from {resource}
                      </Text>
                      <Text pt='1' fontSize='sm'>
                        ...
                      </Text>
                    </HStack>
                    <HStack>
                      <Text size='xs' fontWeight='bold'>
                      {answer} article 2 from {resource}
                      </Text>
                      <Text pt='2' fontSize='sm'>
                      ...
                      </Text>
                    </HStack>
                    <HStack>
                      <Text size='xs' fontWeight='bold'>
                      {answer} article 3 from {resource}
                      </Text>
                      <Text pt='2' fontSize='sm'>
                      ...
                      </Text>
                    </HStack>
                    <HStack>
                      <Text size='xs'fontWeight='bold'>
                      {answer} article 4 from {resource}
                      </Text>
                      <Text pt='2' fontSize='sm'>
                      ...
                      </Text>
                    </HStack>
                    <HStack>
                      <Text size='xs' fontWeight='bold'>
                      {answer} article 5 from {resource}
                      </Text>
                      <Text pt='2' fontSize='sm'>
                      ...
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