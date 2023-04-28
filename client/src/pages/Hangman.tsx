import React, { useState, useEffect } from "react";
import HangmanDrawing from "../components/HangmanDrawing";
import HangmanWord from "../components/HangmanWord";
import Keyboard from "../components/Keyboard";
import words from "../wordList.json";

interface Word {
  category: keyof typeof words;
  word: string;
}

const Hangman:React.FC = () => {
  const [wordToGuess, setWordToGuess] = useState<Word>({ category: "Animals", word: "" });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const wrongGuesses = guessedLetters.filter(letter => !wordToGuess.word.includes(letter)).length;

  const getRandomWord = () => {
    const randomCategory = Object.keys(words)[Math.floor(Math.random() * Object.keys(words).length)] as keyof typeof words;
    const randomWord = words[randomCategory][Math.floor(Math.random() * words[randomCategory].length)];

    return { category: randomCategory, word: randomWord };
  };
  
  useEffect(() => {
    setWordToGuess(getRandomWord());
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
