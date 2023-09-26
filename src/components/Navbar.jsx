import React from 'react'
import {Stack, IconButton, useDisclosure, Collapse, Box, List, ListItem} from "@chakra-ui/react"
import { HamburgerIcon } from '@chakra-ui/icons'

import NavbarData from './NavbarData'
import { useNavigate } from "react-router" ;


function Navbar() {

  const navigate = useNavigate()

  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack
    className="Sidebar">
      <IconButton
      icon={<HamburgerIcon/>}
      height='4vh'
      onClick={onToggle}
      id='contextMenu'
      mb='-2'
      bg='RGBA(255, 255, 255, 0.08)'
      />
      <Collapse in={!isOpen} animateOpacity>
        <Stack 
        className="Sidebar"
        bg={isOpen? '' : '#171923'}
        rounded={'lg'}
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
          </List>
        </Stack>
      </Collapse>
    </Stack>
  )
}

export default Navbar