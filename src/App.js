import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import Views from './Views';
import Navbar from './components/Navbar';

function App() {
  return (
    <ChakraProvider>
      <Views/>
    </ChakraProvider>
  );
}

export default App;
