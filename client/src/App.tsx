import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import HangmanDrawing from "./components/HangmanDrawing";
import Keyboard from "./components/Keyboard";
import Hangman from "./pages/Hangman";
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
