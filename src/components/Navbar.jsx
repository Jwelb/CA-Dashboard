import React from 'react'
import {Stack, IconButton, useDisclosure, Collapse, Box} from "@chakra-ui/react"
import { HamburgerIcon } from '@chakra-ui/icons'

import NavbarData from './NavbarData'
import { useNavigate } from "react-router" ;
import { useState } from 'react';


function Navbar() {

  const navigate = useNavigate()


  const { isOpen, onToggle } = useDisclosure()

  return (
    <>
    <Stack className="Sidebar">
      <IconButton
      height='4vh'
      onClick={onToggle}
      id='contextMenu'
      icon={<HamburgerIcon/>}
      />
      <Collapse in={!isOpen} animateOpacity>
      <ul className='sideBarList' >
      <li className="row" id="name"></li>
        <li className="row"></li>
        {NavbarData.map((val, key) => {
        return (
          <li key={key} 
            className="row"
            id="link"
            onClick={() => {
              navigate(val.link)
            }}>
            <Box id="icon" mr={3}>{val.icon}</Box>
            <Box id="title">{val.title}</Box>
          </li>
          )})}
      </ul>
      </Collapse>

    </Stack>
    </>
  )
}

export default Navbar