const express = require('express')
const router = express.Router()
const client = require("../database/database");

client.connect() ;

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);

router.post('/getAnswer', async (req, res) => {
    await delay(3000)

    // const answer = LLAMA MODEL

    question = req.body.question
    const date = new Date()

    await client.query("INSERT INTO \"Civil-Affairs-DB\" VALUES($1,$2,$3)",
    [question, date, question])

    console.log('Query successfully sent.')
    
    res.send(question)
})

module.exports = router 