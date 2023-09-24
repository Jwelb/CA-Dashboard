import { ChatIcon, Search2Icon } from '@chakra-ui/icons'
import {BiBarChartAlt2} from 'react-icons/bi'
import { FiSettings, FiHelpCircle } from 'react-icons/fi'
import { BsMap } from 'react-icons/bs'

export const NavbarData= [
    {
        title: "Chat",
        link: "/Chat",
        icon: <ChatIcon/>
    },
    {
        title: "Search",
        link: "/Search",
        icon: <Search2Icon/>
    },
    {
        title: "Map",
        link: "/Map",
        icon: <BsMap/>
    },
    {
        title: "Trends",
        link: "/Trends",
        icon: <BiBarChartAlt2/>
    },
    {
        title: "Settings",
        link: "/Settings",
        icon: <FiSettings/>
    },
    {
        title: "Help",
        link: "/Help",
        icon: <FiHelpCircle/>
    }
]

export default NavbarData