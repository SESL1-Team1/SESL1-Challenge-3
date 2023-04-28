type HangmanWordProps = {
    wordToGuess: string;
    guessedLetters: string[];
}

const HangmanWord = ({ wordToGuess, guessedLetters }: HangmanWordProps) => {
    return (
            <div style={{ 
                display: "flex",
                gap: "2rem",
                fontSize: "2rem",
                fontWeight: "bold",
                textTransform: "capitalize",
                fontFamily: "monospace",
                alignItems:"center"
            }}>
                {wordToGuess.split("").map((letter, index) => (
                    <span style={{ borderBottom: "3px solid black" }} key={index}>
                        <span style={{
                            visibility: guessedLetters.includes(letter) ? "visible" : "hidden"
                        }}>{letter}</span>
                    </span>
                ))}
            </div>
    )
}

export default HangmanWord;