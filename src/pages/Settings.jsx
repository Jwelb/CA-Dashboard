
import React from "react";
import Navbar from "../components/Navbar";
import {HStack} from '@chakra-ui/react'
  
const Settings = () => {
  return (
    <HStack>
      <Navbar></Navbar>
      <h1>Settings Page</h1>
    </HStack>
  );
};
  
export default Settings;