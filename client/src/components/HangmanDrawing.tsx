type HangmanDrawingProps = {
    wrongGuesses: number;
};

const HangmanDrawing = ({ wrongGuesses }: HangmanDrawingProps) => {
  return (
    <svg height="500" width="400" className="hangmanDrawing">
        <line x1="120" y1="40" x2="280" y2="40" stroke="black" strokeWidth="4"/>
        <line x1="280" y1="40" x2="280" y2="100" stroke="black" strokeWidth="4"/>
        <line x1="120" y1="40" x2="120" y2="460" stroke="black" strokeWidth="4" />
        <line x1="40" y1="460" x2="200" y2="460" stroke="black" strokeWidth="4"/>
        {/* <!-- Head --> */}
        {wrongGuesses > 0 && <circle cx="280" cy="120" r="20" stroke="black" strokeWidth="4" fill="transparent" />}
        {/* <!-- Body --> */}
        {wrongGuesses > 1 && <line x1="280" y1="140" x2="280" y2="220" stroke="black" strokeWidth="4" />}
        {/* <!-- Left Arm --> */}
        {wrongGuesses > 2 && <line x1="280" y1="160" x2="230" y2="200" stroke="black" strokeWidth="4" />}
        {/* <!-- Right Arm --> */}
        {wrongGuesses > 3 && <line x1="280" y1="160" x2="330" y2="200" stroke="black" strokeWidth="4" />}
        {/* <!-- Left Leg --> */}
        {wrongGuesses > 4 && <line x1="280" y1="220" x2="260" y2="280" stroke="black" strokeWidth="4" />}
        {/* <!-- Right Leg --> */}
        {wrongGuesses > 5 && <line x1="280" y1="220" x2="300" y2="280" stroke="black" strokeWidth="4" />}
    </svg>
    );
};

export default HangmanDrawing;
