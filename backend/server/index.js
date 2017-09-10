const app = require('express')()
const server = require('http').createServer(app)
const WebSocket = require('ws')
const bodyParser = require('body-parser')
const path = require('path')
const scraper = require('../scraper')

const wss = new WebSocket.Server({ server })

// Add headers
app.use((req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next()
})

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '..','..', 'dist') })
})

app.post('/', async (req, res)=> {
    res.send('Got a POST request')
    const a = await scraper.processScrapeRequest(req.body)
    console.log(a)
})

wss.on('connection', () => { console.log('connected to socket') })

server.listen(3000, () => {
    console.log('App listening on port 3000!')
})
