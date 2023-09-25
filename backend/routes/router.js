const express = require('express')
const router = express.Router()

router.post('/test', (req, res) => {
    const question = req.body
    res.send(question)
})

module.exports = router 