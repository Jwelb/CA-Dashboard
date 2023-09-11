import './App.css';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
    <div className="App">
      <p>Hello</p>
    </div>
    </ChakraProvider>
  );
}

export default App;
