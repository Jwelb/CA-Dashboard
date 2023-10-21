import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {HStack, Text, VStack, Box, Textarea} from '@chakra-ui/react'
import { EnvContext } from '../components/envContext';
  
const Document = () => {
    const {env} = useContext(EnvContext)
    const {setEnv} = useContext(EnvContext)

    const [arr, setArr] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(env.documentBuildContents){
            setArr(env.documentBuildContents)
            setLoading(false)
        }
      }, [env])

    return (
        <HStack
        w="100vw"
        h='100vh'>
        <Box>{Navbar()}</Box>
        {console.log(env)}
        {!loading &&
        <Box>
            {arr.map((doc,index) => (
                <div key={index}>
                    {doc.map((object) => (
                        <div key={object.id}>
                            {console.log(object)}
                            <Textarea resize={'none'}>{object.entry}</Textarea>
                            <Text>{object.author}</Text>
                            <Text>{object.link}</Text>
                            <br></br>
                        </div>
                    ))}
                </div>
            ))}
        </Box>
    }
    </HStack>
    );
};
  
export default Document;