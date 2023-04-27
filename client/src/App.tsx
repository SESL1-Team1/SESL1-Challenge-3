import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import HangmanDrawing from "./components/HangmanDrawing";
import Keyboard from "./components/Keyboard";
import Hangman from "./pages/Hangman";

function App() {

  return (
    <ChakraProvider>
      <Hangman />
      
      <Keyboard />
    </ChakraProvider>
  )
}

export default App;
