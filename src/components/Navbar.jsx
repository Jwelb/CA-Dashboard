import React from 'react'
import {Stack, IconButton} from "@chakra-ui/react"
import { HamburgerIcon } from '@chakra-ui/icons'

import NavbarData from './NavbarData'
import { useNavigate } from "react-router" ;
import { useState } from 'react';


function Navbar() {

  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(true)

  return (
    <Stack className="Sidebar">
      <IconButton
      height='4vh'
      onClick={() => {
        setIsOpen(!isOpen)
      }}
      icon={<HamburgerIcon/>}
      />
      <ul className='sideBarList' id={isOpen === true ? "show" : "hidden"}>
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
          <div id="title">{val.title}</div>
          </li>
          )})}
      </ul>

    </Stack>
  )
}

export default Navbar