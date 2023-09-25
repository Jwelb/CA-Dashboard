import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import Views from './Views';

function App() {
  return (
    <ChakraProvider>
      <Views/>
    </ChakraProvider>
  );
}

export default App;
