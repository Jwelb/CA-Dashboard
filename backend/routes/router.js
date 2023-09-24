const express = require('express')
const router = express.Router()

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);

router.post('/getAnswer', async (req, res) => {
    await delay(1000)
    console.log(req.body.question)
    res.send(req.body.question)
})

module.exports = router 