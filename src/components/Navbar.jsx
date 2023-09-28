import React from 'react'
import {Stack, IconButton, useDisclosure, Collapse, Box, List, ListItem, useColorModeValue} from "@chakra-ui/react"
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
      />
      <Collapse in={!isOpen} animateOpacity>
        <Stack 
        className="Sidebar"
        bg={barColor}
        rounded={'lg'}
        color={textColor}
        >
          
          <List className='sideBarList'>
            {NavbarData.map((val, key) => {
            return (
              <ListItem 
                key={key} 
                className="row"
                mt={2}
                mb={2}
                id={window.location.pathname === val.link ? "active" : "" }
                rounded={'lg'}
                onClick={() => {
                  navigate(val.link)
                }}>
                <Box id="icon" mr={3} >{val.icon}</Box>
                <Box id="title">{val.title}</Box>
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