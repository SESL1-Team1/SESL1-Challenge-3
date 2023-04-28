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
import axios from 'axios';
import { useNavigate } from "react-router-dom";

//static data for style testing
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

const deployment_url = "https://sesl-1-challenge-3.vercel.app/play/"; //Notice the ending slash!
const server_url = "https://sesl1-challenge-3-production.up.railway.app";

const Home = ()=>{
    const [sorted_leaders, setLeaders] = useState<Leader[]>([]);

    useEffect(()=>{
        const fetchLeaderBoard = async()=>{
            const response = await axios.get(`${server_url}/getLeaderboard`, {});
            if (response.status === 200 || 304) {
                const data = response.data.message;
                console.log(data);
                let unsorted_leaders:Leader[] = data.map((l: {_id:string; name: string; score: number;}) => { return {name:l.name, wrongGuesses:l.score} });
                console.log(unsorted_leaders);
                const leaders = unsorted_leaders.sort(
                    function (object1:Leader, object2:Leader) {
                        return object1.wrongGuesses - object2.wrongGuesses;
                    }   
                ).slice(0,5);
                console.log("leader",leaders);
                setLeaders(leaders);
            }else{
                console.log(response.status);
                console.log(response.data.message);
            }
        }
        fetchLeaderBoard();
    },[]);

    // Custom words modal
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [customWord, setCustomWord] = useState("");
    const isError = !customWord || !customWord?.trim() || !/^[a-zA-Z ]+$/.test(customWord)
    const [enterWordDisabled, setEnterWordDisabled] = useState(false);
    const [customLink, setCustomLink] = useState("");
    const [isLinkLoading, setLinkLoading] = useState(true);

    const handleInputChange = (e:any) => setCustomWord(e.target.value);
    const handleWordSet = async () => {
        setEnterWordDisabled(true);
        setLinkLoading(true);
        //1. request link
        const response = await axios.post(`${server_url}/setWord`, {
            word: customWord,
        });
        if (response.status === 200 || 304) {
            //2. set link
            setCustomLink(`${deployment_url}${response.data.message}`);
            console.log(response.data.message);
            //3. set link not loading
            setLinkLoading(false);
        }else{
            alert("An internet error has occurred. Please retry!");
            handleReset();
        }   
    }

    const handleCopy = () => {
        if (!customLink){
            //almost impossible to encounter this situation
            alert("Set your word first!");
        }else{
            //copy the link to clipboard
            navigator.clipboard.writeText(customLink);
        }
    }
    const handleReset = () => {
        setCustomLink("");
        setLinkLoading(true);
        setCustomWord("");
        setEnterWordDisabled(false);
    }

    const navigate = useNavigate();

    return(
        <>  
            <Grid height={"100vh"} templateColumns={"30% auto"} templateAreas={`"board main"`}>
                <GridItem area={'board'} h={"100%"} minH={"80%vh"} width={"100%"} py={0}>
                    <LeaderBoard data={sorted_leaders}/>
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
                                {/* navigator target may need modification */}
                                <Button size='lg' colorScheme='yellow' mt='24px' onClick={()=>{navigate("/play")}}> 
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
                                        <Button colorScheme='yellow' textColor={"black"} mr={3} isDisabled={customLink===""} isLoading={enterWordDisabled && customLink==="" && isLinkLoading} onClick={handleCopy}><Copy/>Copy Link</Button>
                                        <Button colorScheme='white' textColor={"black"} variant = "outline" onClick={handleReset} isDisabled={!enterWordDisabled}>
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