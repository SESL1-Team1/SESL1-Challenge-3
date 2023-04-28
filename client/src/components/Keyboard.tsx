import React, { useRef, useState, useEffect } from "react";
import "react-simple-keyboard/build/css/index.css";
import KeyboardReact from "react-simple-keyboard";

interface KeyboardProps {
    guessedLetters: string[];
    onKeyPress: (button: string) => void;
    physicalKeyboard: boolean;
}

const Keyboard = ({ guessedLetters, onKeyPress, physicalKeyboard }: KeyboardProps) => {
    const [input, setInput] = useState<string>("");
    const [disabledKeys, setDisabledKeys] = useState<string[]>([]);
    const keyboard = useRef();

    const onChange = (input: string) => {
        setInput(input);
    };

    const handleKeyPress = (button: string) => {
        setDisabledKeys(prevDisabledKeys => [...prevDisabledKeys, button]);
        onKeyPress(button);
    };

    const onKeyPressWrapper = (button: string) => {
        if (disabledKeys.includes(button)) {
            return
        }
        handleKeyPress(button);
    };

    useEffect(() => {
        setDisabledKeys(guessedLetters);
    }, [guessedLetters]);

    return (
        <div style={{ maxWidth: "500px" }}>
            <KeyboardReact
                keyboardRef={(r: any) => (keyboard as any).current = r}
                onChange={onChange}
                onKeyPress={onKeyPressWrapper}
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
                    }
                  ]}
                theme={"hg-theme-default hg-layout-default hg-yellow"}
                physicalKeyboardHighlight={physicalKeyboard}
                physicalKeyboardHighlightPress={physicalKeyboard}
            />
        </div>
    );
};

export default Keyboard;