const express = require('express')
const router = express.Router()
const axios = require('axios');
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
        if(req.session.env){                             // Maintain Environment
            req.session.env = {
                environment: req.session.env.environment,
                targetAddress: req.session.env.targetAddress,
                portNumber: req.session.env.portNumber,
                chatHistory: req.session.env.chatHistory,
                searchHistoryDocs: req.session.env.searchHistoryDocs,
                searchHistoryGoogleDocs: req.session.env.searchHistoryGoogleDocs,
                documentBuildContents: req.session.env.documentBuildContents
            }
            res.json(req.session.env)
        }else{                                          // Default Environment
            req.session.env = {
                environment: 'Development',
                targetAddress: '127.0.0.1',
                portNumber: '5000',
                chatHistory: [],
                searchHistoryDocs: [],
                searchHistoryGoogleDocs: [],
                documentBuildContents: []
            }
            res.json(req.session.env)
        }
    })
    .post(async (req,res) => {
        req.session.env = {                            // Change Environment
            environment: req.body.environment,
            targetAddress: req.body.targetAddress,
            portNumber: req.body.portNumber,
            chatHistory: req.body.chatHistory,
            searchHistoryDocs: req.body.searchHistoryDocs,
            searchHistoryGoogleDocs: req.body.searchHistoryGoogleDocs,
            documentBuildContents: req.body.documentBuildContents
        }
        res.json(req.session.env)
})

router
    .route('/searchSolr')    
    .get(async (req, res) => {
    const query = req.query.q;
    console.log(query, 'is the query')
    try {
        const apiKey = 'AIzaSyCA0NoHS71O1M_AgsM4s_iAbjZ4f9IYRg4'
        const cx = '97fdc22051d1a47f8'
        await axios({
            method: 'GET',
            url: `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cx}`,
            headers: {
            'Content-type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
            'Accept': '/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            },
        }).then(data => {
            googleRes = data.data.items
        })
        /*
        await client.query("INSERT INTO \"chat_queries\" VALUES($1,$2,$3)",
            [question, date, question])
        */
        console.log('Query successfully sent.')
    } catch (error) {
        console.error('Error making request:', error);
        res.status(500).send('Internal Server Error');
    }
  
    const strQuery = solrClient.query().q(query);
  
    solrClient.search(strQuery, function (err, result) {
    if (err) {
       console.log(err);
       return;
    }
    const solrRes = result.response
    //console.log(result.response)
    res.json({solrResult: solrRes, googleResult: googleRes})
 });
});
  

module.exports = router 