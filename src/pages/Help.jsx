import React from "react";
import Navbar from "../components/Navbar";
import { HStack } from "@chakra-ui/react";
  
const Help = () => {
  return (
    <HStack>
      <Navbar></Navbar>
      <h1>Help Page</h1>
    </HStack>
  );
};
  
export default Help;