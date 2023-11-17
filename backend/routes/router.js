const express = require('express')
const router = express.Router()
const axios = require('axios');

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);
  
// Set logger level (can be set to DEBUG, INFO, WARN, ERROR, FATAL or OFF)
require('log4js').getLogger('solr-node').level = 'DEBUG';

router
    .route('/chatQuery')
    .post(async (req, res) => {
        question = req.body.question
        console.log({Question: question})
        // IP ADDRESS VARIABLE 
        // PORT NUMBER ADDRESS VARIABLE
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
                currentDocument: req.session.env.currentDocument,
                solrConfig: req.session.env.solrConfig
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
                currentDocument: '',
                solrConfig: false
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
            currentDocument: req.body.currentDocument,
            solrConfig: req.body.solrConfig
        }
        res.json(req.session.env)
})

router 
    .route('/uploadSolrFile')
    .post(async (req, res) => {
      console.log(req.body)
      res.send(req.body)
    })

router
    .route('/configureSolr')
    .post(async (req, res) => {
 
        contentField = '{ "add-field": { "name":"content", "type":"text_general", "indexed":true, "stored":true } }'
        console.log({field: contentField})
        // base = ('http://' + 
        //     req.body.environment.llamaTargetAddress + ":" +
        //     req.body.environment.llamaPortNumber  + 
        //     '/chatQuery')

        // finalURL = base.concat("?question=" + encodeURIComponent(question))

        await axios({
            method: 'POST',
            url: 'http://solr:8983/solr/gettingstarted/schema',
            headers: {
            'Content-type': 'application/json',
            },
            data: contentField
        }).then(data => {
            console.log(data)
        }).catch(error => {
          if (error.response && error.response.data && error.response.data.error && error.response.data.error.msg.includes("Field 'content' already exists")) {
            // Do nothing, as this is the expected error message
            console.log("Ignoring error: /update/extract already exists");
          } else {
            // Handle other errors
            console.error(error);
        }})

        await axios({
          method: 'post',
          url: 'http://solr:8983/solr/gettingstarted/config', 
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            'add-requestHandler': {
              name: '/update/extract',
              class: 'solr.DumpRequestHandler',
              startup: 'lazy',
              defaults: {
                lowernames: true,
                'fmap.content': '_text_',
              },
            }
          },
        }).catch(error => {
          if (error.response && error.response.data && error.response.data.error && error.response.data.error.msg.includes("/update/extract already exists")) {
            // Do nothing, as this is the expected error message
            console.log("Ignoring error: /update/extract already exists");
          } else {
            // Handle other errors
            console.error(error);
        }})

        res.send('Success')
        /*
        const date = new Date()
        await client.query("INSERT INTO \"chat_queries\" VALUES($1,$2,$3)",
            [question, date, question])
        */
            
    })

router
    .route('/searchSolr')    
    .post(async (req, res) => {
    const query = req.body.question;
    console.log(query, 'is the query')
    if(req.body.env.solrEnvironment == 'Production'){
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
            res.status(500).send('Internal Server Error');
        }             
        const solrQuery = `http://solr:${req.body.env.solrPortNumber}/solr/gettingstarted/select?fl=id%2Cauthor%2Cdate%2Ctitle&hl.fl=*&hl.q=${query}&hl=true&indent=true&q.op=OR&q=content%3A%5B*%20TO%20*%5D&useParams=`
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
    }else{
        await delay(3000)
        solrRes = 
        [
            {
              date: [ '2009-04-21T19:12:37Z' ],
              author: [ 'whitedj' ],
              title: [
                'Microsoft PowerPoint - 1 Atlantica Cover Mar 09.ppt [Compatibility Mode]'
              ],
              id: '64f5ef70-c1e5-4cda-b3e6-901233a3fd5e',
              content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sem arcu, fringilla sed mi ac, dictum bibendum ex. Vivamus quis mattis ipsum. Ut vel sollicitudin magna. In convallis, lacus sollicitudin egestas vestibulum, augue nibh imperdiet magna, ac elementum urna risus sit amet odio. Vivamus scelerisque metus et lacus ornare, a posuere nunc mattis. Aenean ac quam sit amet nisl aliquet viverra. Aliquam aliquet quis ligula id \
              interdum. Maecenas pellentesque metus vitae sodales rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus pretium accumsan blandit. Nulla congue mollis condimentum. Aliquam vitae faucibus enim.Fusce et eleifend nulla. Quisque accumsan turpis quis sem luctus, sit amet iaculis nisi convallis. Nullam vitae velit mauris. Curabitur ornare neque quis rhoncus sodales. Praesent rhoncus convallis nibh, \
              ut fermentum lectus. Pellentesque varius dolor metus, tempus sollicitudin lacus pellentesque sit amet. Integer facilisis cursus orci, ac ornare arcu iaculis sit amet.'
            },
            {
              date: [ '2009-04-21T19:12:37Z' ],
              author: [ 'whitedj' ],
              title: [
                'Microsoft PowerPoint - 1 Atlantica Cover Mar 09.ppt [Compatibility Mode]'
              ],
              id: '35cd6a27-7e2c-47e8-b9be-d1954489807f',
              content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sem arcu, fringilla sed mi ac, dictum bibendum ex. Vivamus quis mattis ipsum. Ut vel sollicitudin magna. In convallis, lacus sollicitudin egestas vestibulum, augue nibh imperdiet magna, ac elementum urna risus sit amet odio. Vivamus scelerisque metus et lacus ornare, a posuere nunc mattis. Aenean ac quam sit amet nisl aliquet viverra. Aliquam aliquet quis ligula id \
              interdum. Maecenas pellentesque metus vitae sodales rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus pretium accumsan blandit. Nulla congue mollis condimentum. Aliquam vitae faucibus enim.Fusce et eleifend nulla. Quisque accumsan turpis quis sem luctus, sit amet iaculis nisi convallis. Nullam vitae velit mauris. Curabitur ornare neque quis rhoncus sodales. Praesent rhoncus convallis nibh, \
              ut fermentum lectus. Pellentesque varius dolor metus, tempus sollicitudin lacus pellentesque sit amet. Integer facilisis cursus orci, ac ornare arcu iaculis sit amet.'
            },
            {
              date: [ '2012-11-16T13:44:28Z' ],
              author: [ 'daubod1' ],
              title: [ 'NSAD-R-12-045_INTSUM 28 (W+036 to W+042)' ],   
              id: '5638596f-e556-44ea-b1ac-19560770be8e',
              content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sem arcu, fringilla sed mi ac, dictum bibendum ex. Vivamus quis mattis ipsum. Ut vel sollicitudin magna. In convallis, lacus sollicitudin egestas vestibulum, augue nibh imperdiet magna, ac elementum urna risus sit amet odio. Vivamus scelerisque metus et lacus ornare, a posuere nunc mattis. Aenean ac quam sit amet nisl aliquet viverra. Aliquam aliquet quis ligula id \
              interdum. Maecenas pellentesque metus vitae sodales rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus pretium accumsan blandit. Nulla congue mollis condimentum. Aliquam vitae faucibus enim.Fusce et eleifend nulla. Quisque accumsan turpis quis sem luctus, sit amet iaculis nisi convallis. Nullam vitae velit mauris. Curabitur ornare neque quis rhoncus sodales. Praesent rhoncus convallis nibh, \
              ut fermentum lectus. Pellentesque varius dolor metus, tempus sollicitudin lacus pellentesque sit amet. Integer facilisis cursus orci, ac ornare arcu iaculis sit amet.'
            },
            {
              date: [ '2012-11-26T10:55:47Z' ],
              author: [ 'daubod1' ],
              title: [ 'NSAD-R-12-045_INTSUM 25 (W+015 to W+021)' ],   
              id: '33aa1229-2ada-450f-ac5b-aa2e29d34ab4',
              content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sem arcu, fringilla sed mi ac, dictum bibendum ex. Vivamus quis mattis ipsum. Ut vel sollicitudin magna. In convallis, lacus sollicitudin egestas vestibulum, augue nibh imperdiet magna, ac elementum urna risus sit amet odio. Vivamus scelerisque metus et lacus ornare, a posuere nunc mattis. Aenean ac quam sit amet nisl aliquet viverra. Aliquam aliquet quis ligula id \
              interdum. Maecenas pellentesque metus vitae sodales rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus pretium accumsan blandit. Nulla congue mollis condimentum. Aliquam vitae faucibus enim.Fusce et eleifend nulla. Quisque accumsan turpis quis sem luctus, sit amet iaculis nisi convallis. Nullam vitae velit mauris. Curabitur ornare neque quis rhoncus sodales. Praesent rhoncus convallis nibh, \
              ut fermentum lectus. Pellentesque varius dolor metus, tempus sollicitudin lacus pellentesque sit amet. Integer facilisis cursus orci, ac ornare arcu iaculis sit amet.'
            },
            {
                date: [ '2012-11-26T10:55:47Z' ],
                author: [ 'daubod1' ],
                title: [ 'NSAD-R-12-045_INTSUM 25 (W+015 to W+021)' ],   
                id: '33aa1229-2ada-450f-ac5b-aa2e29d34ab4',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sem arcu, fringilla sed mi ac, dictum bibendum ex. Vivamus quis mattis ipsum. Ut vel sollicitudin magna. In convallis, lacus sollicitudin egestas vestibulum, augue nibh imperdiet magna, ac elementum urna risus sit amet odio. Vivamus scelerisque metus et lacus ornare, a posuere nunc mattis. Aenean ac quam sit amet nisl aliquet viverra. Aliquam aliquet quis ligula id \
                interdum. Maecenas pellentesque metus vitae sodales rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus pretium accumsan blandit. Nulla congue mollis condimentum. Aliquam vitae faucibus enim.Fusce et eleifend nulla. Quisque accumsan turpis quis sem luctus, sit amet iaculis nisi convallis. Nullam vitae velit mauris. Curabitur ornare neque quis rhoncus sodales. Praesent rhoncus convallis nibh, \
                ut fermentum lectus. Pellentesque varius dolor metus, tempus sollicitudin lacus pellentesque sit amet. Integer facilisis cursus orci, ac ornare arcu iaculis sit amet.'
              },
              {
                date: [ '2012-11-26T10:55:47Z' ],
                author: [ 'daubod1' ],
                title: [ 'NSAD-R-12-045_INTSUM 25 (W+015 to W+021)' ],   
                id: '33aa1229-2ada-450f-ac5b-aa2e29d34ab4',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sem arcu, fringilla sed mi ac, dictum bibendum ex. Vivamus quis mattis ipsum. Ut vel sollicitudin magna. In convallis, lacus sollicitudin egestas vestibulum, augue nibh imperdiet magna, ac elementum urna risus sit amet odio. Vivamus scelerisque metus et lacus ornare, a posuere nunc mattis. Aenean ac quam sit amet nisl aliquet viverra. Aliquam aliquet quis ligula id \
                interdum. Maecenas pellentesque metus vitae sodales rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus pretium accumsan blandit. Nulla congue mollis condimentum. Aliquam vitae faucibus enim.Fusce et eleifend nulla. Quisque accumsan turpis quis sem luctus, sit amet iaculis nisi convallis. Nullam vitae velit mauris. Curabitur ornare neque quis rhoncus sodales. Praesent rhoncus convallis nibh, \
                ut fermentum lectus. Pellentesque varius dolor metus, tempus sollicitudin lacus pellentesque sit amet. Integer facilisis cursus orci, ac ornare arcu iaculis sit amet.'
              }
          ]
        googleRes = [
                {
                  kind: 'customsearch#result',
                  title: 'What is Autism Spectrum Disorder? | CDC',        
                  htmlTitle: 'What is <b>Autism Spectrum Disorder</b>? | CDC',
                  link: 'https://www.cdc.gov/ncbddd/autism/facts.html',    
                  displayLink: 'www.cdc.gov',
                  snippet: 'Dec 9, 2022 ... Autism Spectrum Disorders (ASDs) are a group of developmental disabilities that can cause significant social, communication and behavioral ...',
                  htmlSnippet: 'Dec 9, 2022 <b>...</b> <b>Autism Spectrum Disorders</b> (ASDs) are a group of developmental disabilities that can cause significant social, communication and behavioral&nbsp;...',
                  cacheId: 'lXC4jl8KqMsJ',
                  formattedUrl: 'https://www.cdc.gov/ncbddd/autism/facts.html',
                  htmlFormattedUrl: 'https://www.cdc.gov/ncbddd/autism/facts.html',
                  pagemap: {
                    cse_thumbnail: [Array],
                    organization: [Array],
                    metatags: [Array],
                    cse_image: [Array]
                  }
                },
                {
                  kind: 'customsearch#result',
                  title: 'NIMH » Autism Spectrum Disorder',
                  htmlTitle: 'NIMH » <b>Autism Spectrum Disorder</b>',     
                  link: 'https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders-asd',
                  displayLink: 'www.nimh.nih.gov',
                  snippet: 'Overview · Difficulty with communication and interaction with other people · Restricted interests and repetitive behaviors · Symptoms that affect their ability ...',    
                  htmlSnippet: 'Overview &middot; Difficulty with communication and interaction with other people &middot; Restricted interests and repetitive behaviors &middot; Symptoms that affect their ability&nbsp;...',
                  cacheId: 'zSbF3S8oJVYJ',
                  formattedUrl: 'https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders-asd',
                  htmlFormattedUrl: 'https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders-<b>asd</b>',
                  pagemap: { cse_thumbnail: [Array], metatags: [Array], cse_image: [Array] }
                },
                {
                  kind: 'customsearch#result',
                  title: 'Signs and Symptoms of Autism Spectrum Disorders | CDC',
                  htmlTitle: 'Signs and Symptoms of <b>Autism Spectrum Disorders</b> | CDC',
                  link: 'https://www.cdc.gov/ncbddd/autism/signs.html',    
                  displayLink: 'www.cdc.gov',
                  snippet: 'Restricted or Repetitive Behaviors or Interests · Lines up toys or other objects and gets upset when order is changed · Repeats words or phrases over and over ( ...',   
                  htmlSnippet: 'Restricted or Repetitive Behaviors or Interests &middot; Lines up toys or other objects and gets upset when order is changed &middot; Repeats words or phrases over and over (&nbsp;...',
                  cacheId: 'K5dNnsyJ4WEJ',
                  formattedUrl: 'https://www.cdc.gov/ncbddd/autism/signs.html',
                  htmlFormattedUrl: 'https://www.cdc.gov/ncbddd/autism/signs.html',
                  pagemap: {
                    cse_thumbnail: [Array],
                    organization: [Array],
                    metatags: [Array],
                    cse_image: [Array]
                  }
                },
                {
                  kind: 'customsearch#result',
                  title: 'Anchorage School District',
                  htmlTitle: '<b>Anchorage School District</b>',
                  link: 'https://www.asdk12.org/',
                  displayLink: 'www.asdk12.org',
                  snippet: "Anchorage School District is Alaska's largest district, serving families in Anchorage, Eagle River and Girdwood.",
                  htmlSnippet: '<b>Anchorage School District</b> is Alaska&#39;s largest district, serving families in Anchorage, Eagle River and Girdwood.',
                  cacheId: '-yEMXT_L6M0J',
                  formattedUrl: 'https://www.asdk12.org/',
                  htmlFormattedUrl: 'https://www.<b>asd</b>k12.org/',      
                  pagemap: {
                    cse_thumbnail: [Array],
                    document: [Array],
                    metatags: [Array],
                    cse_image: [Array]
                  }
                },
                {
                  kind: 'customsearch#result',
                  title: 'ASD Portable Spectrometers & Spectroradiometers | Malvern ...',
                  htmlTitle: '<b>ASD</b> Portable Spectrometers &amp; Spectroradiometers | Malvern ...',
                  link: 'https://www.malvernpanalytical.com/en/products/product-range/asd-range',
                  displayLink: 'www.malvernpanalytical.com',
                  snippet: 'ASD Visible, NIR (and SWIR) spectrometers & spectroradiometers are the industry standard in helping you improve and streamline your research and production.',
                  htmlSnippet: '<b>ASD</b> Visible, NIR (and SWIR) spectrometers &amp; spectroradiometers are the industry standard in helping you improve and streamline your research and production.',
                  cacheId: '2lOWNUY8Vs4J',
                  formattedUrl: 'https://www.malvernpanalytical.com/en/products/product-range/asd-range',
                  htmlFormattedUrl: 'https://www.malvernpanalytical.com/en/products/product-range/<b>asd</b>-range',
                  pagemap: { cse_thumbnail: [Array], metatags: [Array], cse_image: [Array] }
                },
                {
                    kind: 'customsearch#result',
                    title: 'ASD Portable Spectrometers & Spectroradiometers | Malvern ...',
                    htmlTitle: '<b>ASD</b> Portable Spectrometers &amp; Spectroradiometers | Malvern ...',
                    link: 'https://www.malvernpanalytical.com/en/products/product-range/asd-range',
                    displayLink: 'www.malvernpanalytical.com',
                    snippet: 'ASD Visible, NIR (and SWIR) spectrometers & spectroradiometers are the industry standard in helping you improve and streamline your research and production.',
                    htmlSnippet: '<b>ASD</b> Visible, NIR (and SWIR) spectrometers &amp; spectroradiometers are the industry standard in helping you improve and streamline your research and production.',
                    cacheId: '2lOWNUY8Vs4J',
                    formattedUrl: 'https://www.malvernpanalytical.com/en/products/product-range/asd-range',
                    htmlFormattedUrl: 'https://www.malvernpanalytical.com/en/products/product-range/<b>asd</b>-range',
                    pagemap: { cse_thumbnail: [Array], metatags: [Array], cse_image: [Array] }
                  },
                  {
                    kind: 'customsearch#result',
                    title: 'ASD Portable Spectrometers & Spectroradiometers | Malvern ...',
                    htmlTitle: '<b>ASD</b> Portable Spectrometers &amp; Spectroradiometers | Malvern ...',
                    link: 'https://www.malvernpanalytical.com/en/products/product-range/asd-range',
                    displayLink: 'www.malvernpanalytical.com',
                    snippet: 'ASD Visible, NIR (and SWIR) spectrometers & spectroradiometers are the industry standard in helping you improve and streamline your research and production.',
                    htmlSnippet: '<b>ASD</b> Visible, NIR (and SWIR) spectrometers &amp; spectroradiometers are the industry standard in helping you improve and streamline your research and production.',
                    cacheId: '2lOWNUY8Vs4J',
                    formattedUrl: 'https://www.malvernpanalytical.com/en/products/product-range/asd-range',
                    htmlFormattedUrl: 'https://www.malvernpanalytical.com/en/products/product-range/<b>asd</b>-range',
                    pagemap: { cse_thumbnail: [Array], metatags: [Array], cse_image: [Array] }
                  }
        ]
        res.json({solrResult: solrRes, googleResult: googleRes})
    }
 });
  

module.exports = router 