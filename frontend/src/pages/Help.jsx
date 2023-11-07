import React from "react";
import Navbar from "../components/Navbar";
import { HStack, Box } from "@chakra-ui/react";
  
const Help = () => {
  return (
    <HStack
    w="100vw"
    h='100vh'>
      
    <Box>{Navbar()}</Box>

  </HStack>
  );
};
  
export default Help;