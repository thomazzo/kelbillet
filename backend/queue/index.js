const queue = require('kue').createQueue(
    {
        redis:{
            port:6379,
            host:'redis'
        }
    }
)
const scraper = require('../scraper')

queue.on( 'error', function( err ) {
    console.log( 'Queue Error: ', err )
})

queue.process('scrape', (job, done) => {
    scraper.processScrapeRequest(job.data.reqBody).then(
        (tickets) => done(null, tickets) 
    )
})

function queueScrapeJobs(reqBody, wss) {
    let job = queue.create(
        'scrape',
        {
            'reqBody': reqBody
        }
    )
    job.on('complete', function(res) {
        console.log('complete', res)
        wss.send(res)
    })
    job.save()
}

module.exports = {
    queueScrapeJobs
}

