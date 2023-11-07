import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import {HStack, Text, VStack, Box, Textarea, Button, useColorModeValue, useDisclosure} from '@chakra-ui/react'
import { EnvContext } from '../components/envContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {PDFExport, savePDF} from '@progress/kendo-react-pdf'

import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
    Collapse,
    ScaleFade
  } from '@chakra-ui/react'

const Document = () => {
    const {env} = useContext(EnvContext)
    const {setEnv} = useContext(EnvContext)

    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true)

    const buttonColor = useColorModeValue('#F4F7FF','#101720')
    const textColor = useColorModeValue('black','white')
    const contentArea = useRef(null)

    const cancelRef = React.useRef()

    const {
        isOpen: isVisible,
        onClose,
        onOpen,
      } = useDisclosure({ defaultIsOpen: false })
    

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean']                                         // remove formatting button
      ]

    useEffect(() => {
        console.log(env)
        if(env.documentBuildContents){
            setText(setInitialText(env.documentBuildContents))
            setLoading(false)
        }
        let timeout;
        if (isVisible) {
        timeout = setTimeout(() => {
                onClose();
            }, 3000);
        }
        return () => clearTimeout(timeout);
        }, [env, isVisible])


    const handleChange = (content) => {
        setText(content)
    };

    const handleExport = () => {
        //pdfExportComponent.current.save()
        const quillEditor = contentArea.current.querySelector('.ql-editor');
        savePDF(quillEditor, 
            {paperSize: "A4", 
            margin: 40, 
            fileName: `CA Dashboard Document`})
    }

    const handleSave = (vals) => {
        vals.currentDocument = text
        vals.documentBuildContents = []
        fetch("http://localhost:4000/environmentSettings", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(vals),
        })
        .catch(err => {
            return;
        })
        .then(res => {
            if (!res || !res.ok || res.status >= 400) {
            return; 
            }
            return res.json();
        })
        .then(data => {
            setEnv({...data}) ;
        });

    }   

    const setInitialText = (documents) => {
    let result = env.currentDocument
    documents.forEach((object) => {
        object.forEach((doc) => {
            result += 
            `Text: ${doc.entry}\nAuthor: ${doc.author}\nLink: ${doc.link}\n`;
            });
        });
    return result;
    }

    return (
        <HStack
        w="100vw"
        h='100vh'>
        <Box>{Navbar()}</Box>
        <VStack w='100%' h='100%'>
        <Box w='89%' h='95%' className="ql-editor" mt='3vh'>
            <Button 
            mb={'1vh'}
            mr={'1vw'}
            id='contextMenu'
            bg={buttonColor}
            onClick={() => {
                handleSave(env)
                onOpen()
            }}>Save Changes to Document</Button>
            <Button 
            mb={'1vh'}
            id='contextMenu'
            bg={buttonColor}
            onClick={() => {
                handleExport()
            }}>Export as PDF</Button>

            <div ref={contentArea}
            overflowX="auto"
            whiteSpace="wrap"
            overflowY="auto">
                <pre>
                <ReactQuill
                    theme="snow"
                    value={text}
                    onChange={handleChange}
                    modules={{
                        toolbar: toolbarOptions,
                    }}/>
                </pre>
            </div>
        </Box>
        <Box mb='1vh' h='10%'>
        <ScaleFade initialScale={.1} in={isVisible}>
            {isVisible ? (
                <Alert status='success' rounded={10}>
                <AlertIcon />
                <Box>
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                    Your Document was successfully saved
                </AlertDescription>
                </Box>
            </Alert>
            ) : ''}
        </ScaleFade>
        </Box>
    </VStack>
    </HStack>
    );
};
  
export default Document;