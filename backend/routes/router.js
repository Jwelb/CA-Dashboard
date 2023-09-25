const express = require('express')
const router = express.Router()
const client = require("../database/database");

client.connect() ;

<<<<<<< HEAD
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
    
=======
router.post('/test', (req, res) => {
    const question = req.body
>>>>>>> 739636c0d3778d28086c081b87279d8cedd2197e
    res.send(question)
})

module.exports = router 