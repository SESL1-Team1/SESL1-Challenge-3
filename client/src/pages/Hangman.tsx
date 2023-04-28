import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from 'react-router-dom';
import axios from "axios";
import HangmanDrawing from "../components/HangmanDrawing";
import HangmanWord from "../components/HangmanWord";
import Keyboard from "../components/Keyboard";
import words from "../wordList.json";
import { Grid, GridItem, Center, Heading ,Box, Button} from '@chakra-ui/react';
import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    FormControl,
    FormHelperText
} from '@chakra-ui/react'
import { HardDrive } from "iconoir-react";


interface Word {
  category: keyof typeof words | "Customized";
  word: string;
}

const server_url = "http://localhost:9002";

const Hangman:React.FC = () => {
  const { customWordUUID } = useParams();
  const [wordToGuess, setWordToGuess] = useState<Word>({ category: "Animals", word: "" });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const wrongGuesses = guessedLetters.filter(letter => !wordToGuess.word.includes(letter)).length;

  const getRandomWord = () => {
    const randomCategory = Object.keys(words)[Math.floor(Math.random() * Object.keys(words).length)] as keyof typeof words;
    const randomWord = words[randomCategory][Math.floor(Math.random() * words[randomCategory].length)];
    console.log(randomWord);
    return { category: randomCategory, word: randomWord };
  };
  
  useEffect(() => {
    const getTaskRequest = async (id:any) => {
      const response = await axios.post(`${server_url}/getWord`, {
        uuidForWord: id,
      });
      return response;
    };
    const fetchWord = async () => {
      const response = await getTaskRequest(customWordUUID);
      console.log(response.data);
      if (response.status === 200 || 304) {
        setWordToGuess({category:"Customized",word:response.data.message});
      }else{
        alert("Sorry, the word your are finding is gone!")
      }
    };
    if (customWordUUID){
      fetchWord();
    }else{
      setWordToGuess(getRandomWord());
    }
  }, []);

  const handleKeyPress = (button: string) => {
    setGuessedLetters(prevGuessedLetters => [...prevGuessedLetters, button]);
  };

  useEffect(() => {
    if (wrongGuesses === 6) {
      alert("You lose!");
      setWordToGuess(getRandomWord());
      setGuessedLetters([]);
    }
  }, [wrongGuesses]);

  useEffect(() => {
    if (wordToGuess.word) {
      const uniqueLetters = new Set(wordToGuess.word.toLowerCase());
      const guessedUniqueLetters = new Set(guessedLetters.map(l => l.toLowerCase()));

      const checkWin = () => {
        if ([...uniqueLetters].every(letter => guessedUniqueLetters.has(letter))) {
          setWin(true);
        }
      }

      const timeout = setTimeout(checkWin, 750);

      return () => clearTimeout(timeout);
    }
  }, [guessedLetters, wordToGuess]);

  const [isWinning, setWin] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [name, setName] = useState("");
  const isError = !name || !name?.trim();
  const handleInputChange = (e:any) => setName(e.target.value);
  const handleNameSubmit = async ()=>{
    const response = await axios.post(`${server_url}/setLeaderboard`, {
      name: name,
      score: wrongGuesses
    });
    if (response.status === 200 || 304) {
      alert("Name recorded! Enjoy another game ~");
      if (window.confirm("You Win! Play Again?")) {
        setWin(false);
        setWordToGuess(getRandomWord());
        setGuessedLetters([]);
      }
    }else{
      alert("Name uploading failed. Please try again.");
    }   
  }

  const navigate = useNavigate();
  const handleReturn = ()=>{
    navigate("/");
  }

  return (
    <>
      <Box mt={"5%"}>
        <Center><Heading size='2xl'>Hangman</Heading></Center>
        <Center><Heading size='xl' mb={4}> Hint: {wordToGuess.category} </Heading></Center>
      </Box> 
      <Grid templateColumns={"40% auto"} templateAreas={`"hangman guess"`}>
          <GridItem area={'hangman'} h={"100%"} minH={"80%vh"} width={"100%"} py={0}>
            <HangmanDrawing wrongGuesses={wrongGuesses} />
          </GridItem> 
          <GridItem area={'guess'} h={"100%"} minH={"80%vh"} width={"100%"} py={0}>
            <Box mt={"20%"}>
              <HangmanWord wordToGuess={wordToGuess.word} guessedLetters={guessedLetters}/> 
            </Box>
            <Box mt={"10%"} height={"20%"}>
              <Keyboard guessedLetters={guessedLetters} onKeyPress={handleKeyPress} />
            </Box>
            <Box pl={"78%"}>
              <Button colorScheme='yellow' mr={3}  onClick={handleReturn}>Return</Button>
            </Box>
          </GridItem> 
          <Modal isOpen={isWinning} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>You win! Tell everyone your name!</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                  <FormControl isInvalid={isError}>
                      <Input placeholder='Enter name here' type="text" value={name} onChange={handleInputChange}/>
                      {isError ? (
                          <FormHelperText>
                              Please enter a valid name
                          </FormHelperText>
                      ):null}
                  </FormControl>
              </ModalBody>
              <ModalFooter>
                  <Button colorScheme='orange' mr={3} onClick={handleNameSubmit} isDisabled={isError}>
                      Submit
                  </Button>
                  <Button colorScheme='yellow' mr={3} onClick={handleReturn}>
                      Return
                  </Button>
              </ModalFooter>
            </ModalContent>
        </Modal>
      </Grid>
    </>
  );
};

export default Hangman;
