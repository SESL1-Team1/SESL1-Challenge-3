import React, { useState } from "react";
import { ChakraProvider } from '@chakra-ui/react'
import HangmanDrawing from "./components/HangmanDrawing";
import Keyboard from "./components/Keyboard";
import Hangman from "./pages/Hangman";
import Home from './pages/home.js'
import theme from "./theme.js";

function App() {
  return(
    <ChakraProvider theme={theme}>
      <Home/>
    </ChakraProvider>
  );
}

export default App;
