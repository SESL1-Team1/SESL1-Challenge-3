import React, { useState, useEffect } from "react";
import {useParams } from 'react-router-dom';
import axios from "axios";
import HangmanDrawing from "../components/HangmanDrawing";
import HangmanWord from "../components/HangmanWord";
import Keyboard from "../components/Keyboard";
import words from "../wordList.json";

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
          if (window.confirm("You Win! Play Again?")) {
            setWordToGuess(getRandomWord());
            setGuessedLetters([]);
          }
        }
      }

      const timeout = setTimeout(checkWin, 750);

      return () => clearTimeout(timeout);
    }
  }, [guessedLetters, wordToGuess]);

  return (
  <>
    <div>
      <h1>Hangman</h1>
      <h2>Hint: {wordToGuess.category}</h2>
    </div>
    <div>
    <HangmanDrawing wrongGuesses={wrongGuesses} />
    <HangmanWord wordToGuess={wordToGuess.word} guessedLetters={guessedLetters}/>
    <Keyboard guessedLetters={guessedLetters} onKeyPress={handleKeyPress} />
    </div>
  </>
  );
};

export default Hangman;
