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

const server_url = "https://sesl1-challenge-3-production.up.railway.app";

const Hangman:React.FC = () => {
  const { customWordUUID } = useParams();
  const [wordToGuess, setWordToGuess] = useState<Word>({ category: "Animals", word: "" });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const wrongGuesses = guessedLetters.filter(letter => !wordToGuess.word.includes(letter)).length;

  const getRandomWord = () => {
    const randomCategory = Object.keys(words)[Math.floor(Math.random() * Object.keys(words).length)] as keyof typeof words;
    const randomWord = words[randomCategory][Math.floor(Math.random() * words[randomCategory].length)];

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
      if ((response.status === 200 || 304) && response.status!==250) {
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
      setLose(true)
    }
  }, [wrongGuesses]);

  useEffect(() => {
    if (wordToGuess.word) {
      const uniqueLetters = new Set(wordToGuess.word.toLowerCase());
      const guessedUniqueLetters = new Set(guessedLetters.map(l => l.toLowerCase()));

      if ([...uniqueLetters].every(letter => guessedUniqueLetters.has(letter))) {
        setWin(true);
      }
    }
  }, [guessedLetters, wordToGuess]);

  const [isWinning, setWin] = useState(false);
  const [isLosing, setLose] = useState(false);
  const [isSubmitted, setSubmit] = useState(false);
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
        setSubmit(true);
    }else{
      alert("Name uploading failed. Please try again.");
    }   
  }

  const navigate = useNavigate();
  const handleReturn = ()=> {
    navigate("/");
  }
  const handlePlayAgain = ()=> {
    setSubmit(false);
    setWin(false);
    setLose(false);
    setWordToGuess(getRandomWord());
    setGuessedLetters([]);
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
              <Keyboard guessedLetters={guessedLetters} onKeyPress={handleKeyPress} physicalKeyboard={!isWinning && !isLosing} />
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
        <Modal isOpen={isSubmitted} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Name submitted!</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              Play Again?
              </ModalBody>
              <ModalFooter>
                  <Button colorScheme='orange' mr={3} onClick={handlePlayAgain} isDisabled={isError}>
                      Yes
                  </Button>
                  <Button colorScheme='yellow' mr={3} onClick={handleReturn}>
                      No
                  </Button>
              </ModalFooter>
            </ModalContent>
        </Modal>
        <Modal isOpen={isLosing} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>You lose! Nice try!</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                  The word was: "{wordToGuess.word.charAt(0).toUpperCase() + wordToGuess.word.slice(1)}" <br />
                  Play Again?
              </ModalBody>
              <ModalFooter>
                  <Button colorScheme='orange' mr={3} onClick={handlePlayAgain}>
                      Yes
                  </Button>
                  <Button colorScheme='yellow' mr={3} onClick={handleReturn}>
                      No
                  </Button>
              </ModalFooter>
            </ModalContent>
        </Modal>
      </Grid>
    </>
  );
};

export default Hangman;
