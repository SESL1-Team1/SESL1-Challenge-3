import React, { useRef, useState } from "react";
import "react-simple-keyboard/build/css/index.css";
import KeyboardReact from "react-simple-keyboard";

export const guessedLetters = [] as string[];

const Keyboard = () => {
    const [input, setInput] = useState<string>("");
    const [disabledKeys, setDisabledKeys] = useState<string[]>([]);
    const keyboard = useRef();

    const onChange = (input: string) => {
        setInput(input);
    };

    const handleKeyPress = (button: string) => {
        setDisabledKeys(prevDisabledKeys => [...prevDisabledKeys, button]);
        guessedLetters.push(button);
        console.log("gussedLetters: " + guessedLetters)
    };

    const onKeyPress = (button: string) => {
        if (disabledKeys.includes(button)) {
            return
        }
        handleKeyPress(button);
    };

    return (
        <div style={{ maxWidth: "500px" }}>
            <KeyboardReact
                keyboardRef={(r: any) => (keyboard as any).current = r}
                onChange={onChange}
                onKeyPress={onKeyPress}
                layout={{
                    default: [
                        "a b c d e f g h i",
                        "j k l m n o p q r",
                        "s t u v w x y z"
                    ]
                }}
                disableButtonHold={true}
                buttonTheme={[
                    {
                      class: "hg-grey",
                      buttons: disabledKeys.join(" "),
                    },
                  ]}
            />
        </div>
    );
    
};

export default Keyboard;