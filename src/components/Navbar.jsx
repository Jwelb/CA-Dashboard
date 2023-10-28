import React from 'react'
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
      height='4vh'
      onClick={onToggle}
      id='contextMenu'
      mb='-2'
      bg={barColor}
      color={textColor}
      w='100%'
      h='5vh'
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
                mt={1}
                mb={1}
                id={window.location.pathname === val.link ? "active" : "" }
                onClick={() => {
                  navigate(val.link)
                }}>
                <HStack w='100%'>
                    <Box id="icon" w='100%' ml={'20%'} align='left'>{val.icon}</Box>
                    <Box id="title"w='100%' ml={'-20%'} align={'left'}><Text fontSize={'14px'}>{val.title}</Text></Box>
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