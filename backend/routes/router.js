const express = require('express')
const router = express.Router()
const client = require("../database/database");

client.connect() ;

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);

router.post('/chatQuery', async (req, res) => {
    await delay(3000)

    try {
         /*
        const response = await axios.get('http://example.com') 
        const llamaData = response.data
        */
        question = req.body.question
        const date = new Date()

        await client.query("INSERT INTO \"chat_queries\" VALUES($1,$2,$3)",
            [question, date, question])

        console.log('Query successfully sent.')

        res.send(question)
    } catch (error) {
        console.error('Error making request:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/searchQuery', async (req, res) => {
    await delay(3000)

    try {
        /*
       const response = await axios.get('http://example.com') 
       const solrData = response.data 
       */
       question = req.body.question
       const date = new Date()

       await client.query("INSERT INTO \"search_queries\" VALUES($1,$2,$3)",
           [question, date, question])

       console.log('Query successfully sent.')

       res.send(question)
   } catch (error) {
       console.error('Error making request:', error);
       res.status(500).send('Internal Server Error');
   }
});

module.exports = router 