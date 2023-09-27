import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import Views from './Views'
import ToggleColorMode from './components/ToggleColorMode';

function App() {
  return (
    <ChakraProvider>
      <ToggleColorMode/>
      <Views/>
    </ChakraProvider>
  );
}

export default App;
