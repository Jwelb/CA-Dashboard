import React from "react";
import Navbar from "../components/Navbar";
import { HStack, VStack, Input, Textarea, Grid, GridItem, SimpleGrid, Box  } from "@chakra-ui/react";



function Chat(){
  return (

      <SimpleGrid spacing={10} minChildWidth={"100px"}>
        <HStack spacing={'39vw'}>
        <Navbar/>
        <VStack>
        <Box><Input size='lg' placeholder="My question goes here"></Input></Box>
        <Box><Textarea isDisabled placeholder="My question goes here"></Textarea></Box>
        </VStack>
        </HStack>
      </SimpleGrid>
      
    
  );
};
  
export default Chat;