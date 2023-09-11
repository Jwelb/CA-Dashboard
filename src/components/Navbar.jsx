import React from 'react'
import {Stack, Button} from "@chakra-ui/react"
import { HamburgerIcon } from '@chakra-ui/icons'

import NavbarData from './NavbarData'
import { useNavigate } from "react-router" ;


function Navbar() {

  const navigate = useNavigate()

  return (
    <Stack bg='gray' className="Sidebar">
      <ul className='sideBarList'>
      <Button>
        <HamburgerIcon/>
      </Button>
      <li className="row" id="name" ></li>
        <li className="row"></li>
        {NavbarData.map((val, key) => {
        return (
          <li key={key} 
          className="row"
          id={window.location.pathname === val.link ? "active" : "" }
          onClick={() => {
            navigate(val.link)
        }}>
          <div id="icon">{val.icon}</div><div id="title">{val.title} </div>
          </li>
          )
        })}
      </ul>
    </Stack>
  )
}

export default Navbar