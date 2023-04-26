import React, { useState, useEffect } from "react";
import words from "../wordList.json";

interface Word {
  category: keyof typeof words;
  word: string;
}

const Hangman = () => {
  const [wordToGuess, setWordToGuess] = useState<Word>({ category: "Animals", word: "" });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const getRandomWord = () => {
    const randomCategory = Object.keys(words)[Math.floor(Math.random() * Object.keys(words).length)] as keyof typeof words;
    const randomWord = words[randomCategory][Math.floor(Math.random() * words[randomCategory].length)];

    return { category: randomCategory, word: randomWord };
  };

  useEffect(() => {
    setWordToGuess(getRandomWord());
  }, []);

  console.log(wordToGuess);

  return (
    <div>
      <h1>Hangman</h1>
      <h2>{wordToGuess.category}</h2>
      <h3>{wordToGuess.word}</h3>
    </div>
  );
};

export default Hangman;
