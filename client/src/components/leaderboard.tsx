import React from 'react';
import { Heading ,Box, Text, Button, Center, VStack, Card, CardHeader, CardBody} from '@chakra-ui/react';
import { Medal1St } from 'iconoir-react';

type Leader = {
    name: string,
    wrongGuesses: number
};

interface Prop{
    data:Leader[]
}

const LeaderBoard: React.FC<Prop>  = ({data})=>{
    return(
        <Box height={"80%vh"} minHeight={"80%vh"} width="80%" borderWidth='2px' borderRadius='lg' borderColor={"white"} bgColor={"orange.200"} py={"15%"} px={0} my={"10%"} ml={"25%"}>
            <VStack spacing={4}>
                <Heading size='xl' mb={4}> LEADERBOARD </Heading>
                {data.map(item =>
                    <Card key={data.indexOf(item)} variant={"outlined"} mx={"5px"} mt={"0"} width={"90%"} height={"10%"}>
                        <CardHeader pb={0}>
                            <Heading size='md' color={data.indexOf(item) === 0 ? "orange.400":"black"}> {data.indexOf(item) === 0 ? <Medal1St/>:null}{item.name} </Heading>
                        </CardHeader>
                        <CardBody pt={0}>
                            <Text ml={"50%"}>{`Wrong Guesses: ${item.wrongGuesses}`}</Text>
                        </CardBody>
                    </Card>
                )}
            </VStack>
        </Box>
    );
}


export {type Leader};
export default LeaderBoard;