import React, { useState, useEffect } from "react";
import HangmanDrawing from "../components/HangmanDrawing";
import HangmanWord from "../components/HangmanWord";
import words from "../wordList.json";
import { guessedLetters } from "../components/Keyboard";

interface Word {
  category: keyof typeof words;
  word: string;
}

const Hangman = () => {
  const [wordToGuess, setWordToGuess] = useState<Word>({ category: "Animals", word: "" });

  const wrongGuesses = guessedLetters.filter(letter => !wordToGuess.word.includes(letter)).length;

  const getRandomWord = () => {
    const randomCategory = Object.keys(words)[Math.floor(Math.random() * Object.keys(words).length)] as keyof typeof words;
    const randomWord = words[randomCategory][Math.floor(Math.random() * words[randomCategory].length)];

    return { category: randomCategory, word: randomWord };
  };
  
  useEffect(() => {
    setWordToGuess(getRandomWord());
  }, []);

  useEffect(() => {
    if (wrongGuesses === 6) {
      alert("You lose!");
      setWordToGuess(getRandomWord());
    }
  }, [wrongGuesses]);

  // useEffect(() => {
  //   if (wordToGuess.word.split("").every(letter => guessedLetters.includes(letter))) {
  //     alert("You win!");
  //     setWordToGuess(getRandomWord());
  //   }
  // }, [guessedLetters]); bugged, fix later

  console.log(wordToGuess);

  return (
  <>
    <div>
      <h1>Hangman</h1>
      <h2>{wordToGuess.category}</h2>
      <h3>{wordToGuess.word}</h3>
    </div>
    <div>
    {wrongGuesses}
    <HangmanDrawing wrongGuesses={wrongGuesses} />
    <HangmanWord wordToGuess={wordToGuess.word} guessedLetters={guessedLetters}/>
    </div>
  </>
  );
};

export default Hangman;
