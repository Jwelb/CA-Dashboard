const express = require('express')
const router = express.Router()

router.post('/test', (req, res) => {
    console.log(req.body.question)
    res.send('Output Sent for: ' + req.body.question)
})

module.exports = router 