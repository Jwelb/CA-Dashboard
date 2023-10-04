import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import Views from './Views'
import ToggleColorMode from './components/ToggleColorMode';
import UserContext from './components/envContext';

function App() {
  return (
    <UserContext>
      <ChakraProvider>
        <Views/>
      </ChakraProvider>
    </UserContext>
  );
}

export default App;
