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
        console.log(req.body.environment)
        if(req.body.environment.llamaEnvironment == 'Production'){
            try {
                base = ('http://' + 
                    req.body.environment.llamaTargetAddress + ":" +
                    req.body.environment.llamaPortNumber  + 
                    '/chatQuery')

                finalURL = base.concat("?question=" + encodeURIComponent(question))
                
                await axios({
                    method: 'GET',
                    url: finalURL,
                    headers: {
                    'Content-type': 'application/json',
                    },
                }).then(data => {
                    return data.data
                }).then(data => {
                    console.log(data[0].generation.content)
                    answer = data[0].generation.content
                })

                /*
                const date = new Date()
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
        console.log(2)
        res.send(question)
    }
})

router  
    .route('/environmentSettings')
    .get(async (req,res) => {
        if(req.session.env){                             // Maintain Environment
            req.session.env = {
                llamaEnvironment: req.session.env.llamaEnvironment, 
                llamaTargetAddress: req.session.env.llamaTargetAddress, 
                llamaPortNumber: req.session.env.llamaPortNumber,
                solrEnvironment: req.session.env.solrEnvironment, 
                solrTargetAddress: req.session.env.solrTargetAddress, 
                solrPortNumber: req.session.env.solrPortNumber,
                chatHistory: req.session.env.chatHistory,
                searchHistoryDocs: req.session.env.searchHistoryDocs,
                searchHistoryGoogleDocs: req.session.env.searchHistoryGoogleDocs,
                documentBuildContents: req.session.env.documentBuildContents,
                currentDocument: req.session.env.currentDocument
            }
            res.json(req.session.env)
        }else{                                          // Default Environment
            req.session.env = {
                llamaEnvironment: 'Development',
                llamaTargetAddress: '127.0.0.1',
                llamaPortNumber: '5000',
                solrEnvironment: 'Development',
                solrTargetAddress: '127.0.0.1',
                solrPortNumber: '8983',
                chatHistory: [],
                searchHistoryDocs: [],
                searchHistoryGoogleDocs: [],
                documentBuildContents: [],
                currentDocument: ''
            }
            res.json(req.session.env)
        }
    })
    .post(async (req,res) => {
        req.session.env = {                            // Change Environment
            llamaEnvironment: req.body.llamaEnvironment,
            llamaTargetAddress: req.body.llamaTargetAddress,
            llamaPortNumber: req.body.llamaPortNumber,
            solrEnvironment: req.body.solrEnvironment,
            solrTargetAddress: req.body.solrTargetAddress,
            solrPortNumber: req.body.solrPortNumber,
            chatHistory: req.body.chatHistory,
            searchHistoryDocs: req.body.searchHistoryDocs,
            searchHistoryGoogleDocs: req.body.searchHistoryGoogleDocs,
            documentBuildContents: req.body.documentBuildContents,
            currentDocument: req.body.currentDocument
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
            //console.log(googleRes)
        })
        /*
        await client.query("INSERT INTO \"chat_queries\" VALUES($1,$2,$3)",
            [question, date, question])
        */
        console.log('Query successfully sent.')
    } catch (error) {
        console.error('Error making request:', error);
        //res.status(500).send('Internal Server Error');
    }             
    const solrQuery = `http://localhost:8983/solr/gettingstarted/select?fl=id%2Cauthor%2Cdate%2Ctitle&hl.fl=*&hl.q=${query}&hl=true&indent=true&q.op=OR&q=content%3A%5B*%20TO%20*%5D&useParams=`
    await fetch(solrQuery)
    .then(response => response.json())
    .then(data => {
        rawSolrRes = data.response.docs
        highlights = data.highlighting
    })

    const MAX_CHARACTERS = 100

    const solrRes = rawSolrRes.map(item => {
        const newData = {...item}

        // Check if the ID exists in the highlighting object
        newData.content = (highlights[item.id]?.content || 'No Snippet Found');
        return newData
    })
    //console.log(solrRes)
    //console.log(rawSolrRes)
    res.json({solrResult: solrRes, googleResult: googleRes})
    

    // solrClient.search(strQuery, function (err, result) {
    // if (err) {
    //    console.log(err);
    //    return;
    // }
    // const solrRes = result.response
    // //console.log(result.response)
    //res.json({solrResult: solrRes, googleResult: googleRes})
    // }
 });
  

module.exports = router 