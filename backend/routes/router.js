const express = require('express')
const router = express.Router()
const axios = require('axios');
//const { defaults } = require('pg');

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);

router.post('/chatQuery', async (req, res) => {
    question = req.body.question
    console.log({Question: question})
    base = 'http://127.0.0.1:5000/generate_response'

    try {
        await delay(1500)
        finalURL = base.concat("?Question=" + question)
        console.log(finalURL)
        
        /*
        await axios({
            method: 'GET',
            url: finalURL,
            headers: {
              'Content-type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
              'Accept': '*\/*',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
            },
        }).then(data => {
            console.log(data.data[0].generation.content)
            answer = data.data[0].generation.content
            //return data
        })*/

        const date = new Date()
        /*
        await client.query("INSERT INTO \"chat_queries\" VALUES($1,$2,$3)",
            [question, date, question])
        */
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

       /*await client.query("INSERT INTO \"search_queries\" VALUES($1,$2,$3)",
           [question, date, question])*/

       console.log('Query successfully sent.')

       res.send(question)
   } catch (error) {
       console.error('Error making request:', error);
       res.status(500).send('Internal Server Error');
   }
});

module.exports = router 