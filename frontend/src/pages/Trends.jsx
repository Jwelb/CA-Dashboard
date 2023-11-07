
import React from "react";
import Navbar from "../components/Navbar";
import {HStack} from '@chakra-ui/react'
  
const Trends = () => {
  return (
    <HStack
    w="100vw"
    h='100vh'>
    {Navbar()}

  </HStack>
  );
};
  
export default Trends;