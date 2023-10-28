import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import {HStack, Text, VStack, Box, Textarea, Button} from '@chakra-ui/react'
import { EnvContext } from '../components/envContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {PDFExport, savePDF} from '@progress/kendo-react-pdf'

const Document = () => {
    const {env} = useContext(EnvContext)
    const {setEnv} = useContext(EnvContext)

    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true)

    const pdfExportComponent = useRef(null)

    useEffect(() => {
        if(env.documentBuildContents){
            console.log(env.documentBuildContents)
            setText(setInitialText(env.documentBuildContents))
            setLoading(false)
        }
        }, [env])


    const handleChange = (content) => {
        setText(content);
    };

    const handleExport = (event) => {
        pdfExportComponent.current.save()
    }

    const setInitialText = (documents) => {
    let result = ''
    documents.forEach((object) => {
        object.forEach((doc) => {
            result += 
            `Entry ${doc.id + 1}:\nText: ${doc.entry}\nAuthor: ${doc.author}\nLink: ${doc.link}\n\n`;
            });
        });
    console.log(result)
    return result;
    }

    return (
        <HStack
        w="100vw"
        h='100vh'>
        <Box>{Navbar()}</Box>
        {!loading &&
        <Box w='89%' h='95%' className="ql-editor">
            <Button 
            mb={'1vh'}
            id='contextMenu'
            onClick={() => {
                handleExport()
            }}>Export to PDF</Button>
            <PDFExport ref={pdfExportComponent} paperSize='A4'>
                <pre>
                <ReactQuill
                    theme="snow"
                    value={text}
                    onChange={handleChange}
                    modules={{
                        toolbar: [
                        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['bold', 'italic', 'underline'],
                        ['link'],
                        ['clean'],
                        ['button']
                        ],
                    }}/>
                </pre>
            </PDFExport>
        </Box>
    }
    </HStack>
    );
};
  
export default Document;