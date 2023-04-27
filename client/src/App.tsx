import React from "react";
import { ChakraProvider } from '@chakra-ui/react'
import theme from "./theme.js";
import Home from './pages/home.js'

function App() {
  return(
    <ChakraProvider theme={theme}>
      <Home/>
    </ChakraProvider>
  );
}

export default App;
