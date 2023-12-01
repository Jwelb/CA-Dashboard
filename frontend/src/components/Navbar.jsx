import React, { useState } from 'react'
import {Stack, IconButton, useDisclosure, Collapse, Box, List, ListItem, useColorModeValue, Text, HStack} from "@chakra-ui/react"
import { HamburgerIcon } from '@chakra-ui/icons'

import NavbarData from './NavbarData'
import { useNavigate } from "react-router" ;
import ToggleColorMode from './ToggleColorMode';


function Navbar() {

  const navigate = useNavigate()

  const { isOpen, onToggle } = useDisclosure()

  const barColor = useColorModeValue('#F4F7FF','#101720')
  const textColor = useColorModeValue('black','white')

  return (
    <Stack
    className="Sidebar">
      <IconButton
      icon={<HamburgerIcon/>}
      onClick={onToggle}
      id='contextMenu'
      mb='-2'
      bg={barColor}
      color={textColor}
      w='100%'
      h='7vh'
      />
      <Collapse in={!isOpen} animateOpacity>
        <Stack 
        className="Sidebar"
        bg={barColor}
        rounded={'lg'}
        color={textColor}
        w='100%'
        >
          <List className='sideBarList'>
            {NavbarData.map((val, key) => {
            return (
              <ListItem 
                key={key} 
                className="row"
                id={(window.location.pathname === val.link) || (window.location.pathname === '/' && key===0) ? "active" : "non-active" }
                onClick={() => {
                  navigate(val.link)
                }}>
                <HStack w='100%' mr='20%'>
                    <Box id="icon" w='100%' ml={'20%'} align='left'>{val.icon}</Box>
                    <Box id="title"w='100%' ml={'-35%'} align={'left'}><Text fontSize={'16px'}>{val.title}</Text></Box>
                </HStack>
              </ListItem>
              )})}
              <ListItem id='footer'><ToggleColorMode/></ListItem>
          </List>
        </Stack>
      </Collapse>
    </Stack>
  )
}

export default Navbar