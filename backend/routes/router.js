const express = require('express')
const router = express.Router()
const axios = require('axios');
const solr = require('solr-client');
const SolrNode = require('solr-node')


const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);

const solrClient = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'gettingstarted',
    protocol: 'http'
});
  
// Set logger level (can be set to DEBUG, INFO, WARN, ERROR, FATAL or OFF)
require('log4js').getLogger('solr-node').level = 'DEBUG';

router
    .route('/chatQuery')
    .post(async (req, res) => {
        question = req.body.question
        console.log({Question: question})
        // IP ADDRESS VARIABLE 
        // PORT NUMBER ADDRESS VARIABLE

        if(req.body.environment.environment == 'Production'){
            try {
                base = ('http://' + 
                    req.body.environment.targetAddress + ":" +
                    req.body.environment.portNumber  + 
                    '/generate_response')

                finalURL = base.concat("?Question=" + question)
                console.log(finalURL)
                
                await axios({
                    method: 'GET',
                    url: finalURL,
                    headers: {
                    'Content-type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                    'Accept': '/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    },
                }).then(data => {
                    return data.data
                }).then(data => {
                    console.log(data[0].generation.content)
                    answer = data[0].generation.content
                })

                const date = new Date()
                /*
                await client.query("INSERT INTO \"chat_queries\" VALUES($1,$2,$3)",
                    [question, date, question])
                */
                console.log('Query successfully sent.')
                res.send(answer)
            } catch (error) {
                console.error('Error making request:', error);
                res.status(500).send('Internal Server Error');
            }
        }else{
        await delay(2000)
        res.send(question)
    }
})

router  
    .route('/environmentSettings')
    .get(async (req,res) => {
        if(req.session.env){                        // Maintain Session Environment
            req.session.env = {
                environment: req.session.env.environment,
                targetAddress: req.session.env.targetAddress,
                portNumber: req.session.env.portNumber,
                chatHistory: req.session.env.chatHistory
            }
            res.json({
                environment: req.session.env.environment,
                targetAddress: req.session.env.targetAddress,
                portNumber: req.session.env.portNumber,
                chatHistory: req.session.env.chatHistory
            })
        }else{                                      // Setup Initial Connection
            req.session.env = {
                environment: 'Development',
                targetAddress: '127.0.0.1',
                portNumber: '5000',
                chatHistory: []
            }
            res.json({
                environment: 'Development',
                targetAddress: '127.0.0.1',
                portNumber: '5000',
                chatHistory: []
            })
        }
    })
    .post(async (req,res) => {
        req.session.env = {                        // Change Environment
            environment: req.body.environment,
            targetAddress: req.body.targetAddress,
            portNumber: req.body.portNumber,
            chatHistory: req.body.chatHistory
        }
        res.json({
            environment: req.body.environment,
            targetAddress: req.body.targetAddress,
            portNumber: req.body.portNumber,
            chatHistory: req.body.chatHistory
    })
})

router
    .route('/searchSolr')    
    .get(async (req, res) => {
    const query = req.query.q;
    console.log(query, 'is the query')
  
    const strQuery = solrClient.query().q(query);
  
    solrClient.search(strQuery, function (err, result) {
    if (err) {
       console.log(err);
       return;
    }
    console.log(result.response)
    res.json(result.response)
 });
});
  

module.exports = router 