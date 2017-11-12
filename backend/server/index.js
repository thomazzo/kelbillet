const express = require('express')
const app = require('express')()
const server = require('http').createServer(app)
const WebSocket = require('ws')
const bodyParser = require('body-parser')
const path = require('path')

const scraper = require('../scraper')

const kue = require('kue')
const queue = kue.createQueue(
    {
        redis:{
            port:6379,
            host:'redis'
        }
    }
)

queue.on( 'error', function( err ) {
    console.log( 'Queue Error: ', err )
})

queue.process('scrape', (job, done) => {
    scraper.processScrapeRequest(job.data.reqBody).then(
        (tickets) => done(null, tickets) 
    )
})

const wss = new WebSocket.Server({ server })

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    next()
})

app.use(bodyParser.json())


app.use('/', express.static(path.join(__dirname, '..','..', 'dist')))


app.post('/', (req, res)=> {
    for(let t of [0, 5000, 10000]){
        let job = queue.create(
            'scrape',
            {
                'reqBody': req.body
            }
        )
        job.delay(t).save()
    }
    res.send('Jobs Queued')
})

wss.on('connection', function(ws){
    console.log('connected to socket')
    ws.send('connected to socket')
    queue.on('job complete',
        (id, res) => {
            ws.send(JSON.stringify(res))
        }
    )
})

server.listen(3000, () => {
    console.log('App listening on port 3000!')
})
