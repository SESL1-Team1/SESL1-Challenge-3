import React, {useState, useMemo, useEffect} from 'react';
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
import { Copy } from 'iconoir-react';
import LeaderBoard from '../components/leaderboard';
import { Leader } from '../components/leaderboard';

let testLeaderData:Leader[] = [
    {name:"player1", wrongGuesses:3},
    {name:"player2", wrongGuesses:0},
    {name:"player3", wrongGuesses:9},
    {name:"player4", wrongGuesses:8},
    {name:"player5", wrongGuesses:2},
    {name:"player6", wrongGuesses:0},
    {name:"player7", wrongGuesses:1},
    {name:"player8", wrongGuesses:7},
    {name:"player9", wrongGuesses:3},
    {name:"player10", wrongGuesses:4},
];


const Home = ()=>{
    // const static_leaders:Leader[] = useMemo(()=>{
    //     testLeaderData.sort(
    //         function (object1:Leader, object2:Leader) {
    //             return object1.wrongGuesses - object2.wrongGuesses;
    //         }   
    //     )
    //     return static_leaders;
    // }, [testLeaderData])

    //for testing
    testLeaderData.sort(
        function (object1:Leader, object2:Leader) {
            return object1.wrongGuesses - object2.wrongGuesses;
        }  
    );

    // Custom words modal
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [customWord, setCustomWord] = useState("");
    const isError = !customWord || !customWord?.trim() || !/^[a-zA-Z ]+$/.test(customWord)
    const [enterWordDisabled, setEnterWordDisabled] = useState(false);
    const [customLink, setCustomLink] = useState(null);
    const [isLinkLoading, setLinkLoading] = useState(true);

    const handleInputChange = (e:any) => setCustomWord(e.target.value)
    const handleWordSet = () => {
        setEnterWordDisabled(true);
        setLinkLoading(true);
        //1. request link
        //2. set link

        //3. set link not loading
        //setLinkLoading(false);
    }
    const handleCopy = () => {
        if (!customLink){
            //almost impossible to encounter this situation
            alert("Set your word first!");
        }else{
            navigator.clipboard.writeText(customLink);
        }
    }
    const handleReset = () => {
        setCustomLink(null);
        setLinkLoading(true);
        setCustomWord("");
        setEnterWordDisabled(false);
    }

    return(
        <>  
            <Grid height={"100vh"} templateColumns={"30% auto"} templateAreas={`"board main"`}>
                <GridItem area={'board'} height={"100%"} width={"100%"}>
                    <LeaderBoard data={testLeaderData.slice(5)}/>
                </GridItem> 
                <GridItem area={'main'}>
                    <Center my="25%">
                        <Box position='relative' maxW='32rem'>
                            <Heading size='2xl' mb={4}> HANGMAN GAME </Heading>
                            <Center>
                                <Heading size='md'>
                                    Guess the word or ...
                                </Heading>
                            </Center>
                            <Center> 
                                <Button size='lg' colorScheme='yellow' mt='24px'>
                                    Play Now
                                </Button>
                            </Center>
                            <br/>
                            <Center> 
                                <Button size='lg' colorScheme='orange' onClick={onOpen}>
                                    Set Custom Word
                                </Button>
                                <Modal isOpen={isOpen} onClose={onClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                    <ModalHeader>Set Your Word</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <FormControl isInvalid={isError}>
                                            <Input placeholder='Enter word here' type="text" value={customWord} onChange={handleInputChange} disabled={enterWordDisabled}/>
                                            {isError ? (
                                                <FormHelperText>
                                                    Please enter a valid word
                                                </FormHelperText>
                                            ):null}
                                        </FormControl>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme='orange' mr={3} onClick={handleWordSet} isDisabled={isError || enterWordDisabled}>
                                            Set
                                        </Button>
                                        <Button colorScheme='yellow' textColor={"black"} mr={3} disabled={!enterWordDisabled} isLoading={enterWordDisabled && customLink==null && isLinkLoading} onClick={handleCopy}><Copy/>Copy Link</Button>
                                        <Button colorScheme='white' textColor={"black"} mr={3} variant = "outline" onClick={handleReset} isDisabled={enterWordDisabled}>
                                            Reset
                                        </Button>
                                    </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </Center>
                        </Box>
                    </Center>
                </GridItem> 
            </Grid>
        </>
    );
}

export default Home;