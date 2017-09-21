const scraper = require('./scraper')
const db = require('../db')
const _ = require('lodash')

const CITY_IDS = {
    'Paris': [33210, 26687],
    'London': [26687, 33210]}

async function processScrapeRequest(requestBody) {
    const origin = requestBody.origin 
    const selectedDate = requestBody.selectedDate

    if(origin && selectedDate){
        const originId = CITY_IDS[origin][0]
        const arrivalId = CITY_IDS[origin][1]
        const kelbilletDate = convertDate(selectedDate)
        const url = `http://www.kelbillet.com/recherche/recherche-billet.php?ville_depart_id=${originId}&ville_arrivee_id=${arrivalId}&date_aller=${kelbilletDate}`

        const [newTickets, oldTickets] = await Promise.all([scraper.scrapePage(url), getOldTickets(origin, selectedDate)])
        //TODO _.assign origin, dates, ts, arrival to new Tickets to save them
        saveNewTickets(newTickets)
        let currentTickets = {}
        for(let ticket of oldTickets){
            currentTickets[ticket.link] = _.assign({}, ticket, {'status': 'sold'})
        }
        for(let ticket of newTickets) {
            if(currentTickets[ticket.link]){
                currentTickets[ticket.link] = _.assign({}, ticket, {'status': 'available'})
            } 
            else {
                currentTickets[ticket.link] = _.assign({}, ticket, {'status': 'new'})
            }
        }
        return _.values(currentTickets)
    }
    else {console.log('ooops')
    }
}

function convertDate(dateString) {
    const dateSplit = dateString.split('-')
    const departureDate = dateSplit[2] + '/'+ dateSplit[1] + '/' + dateSplit[0]
    return departureDate
}

async function getOldTickets(origin, departureDate) {
    const oldTickets = await db.query('SELECT * FROM tickets WHERE origin=$1 AND departure_date=$2', [origin, departureDate])    
    return oldTickets.rows
}

function saveNewTickets(newTickets) {
    //TODO save new tickets to db
    const stringValues = _.map(newTickets, 
        (t) => 
    `(${}, ${}, ${t.price}, ${t.userName}, ${t.postDate}, ${}, ${t.departureTime}, arrival_date, ${t.arrivalTime}, ${t.link}, ts)`
    )
    `INSERT INTO kelbillet
    (origin, destination, price, user_name, post_date, departure_date, departure_time, arrival_date, arrival_time, url, ts)
    VALUES 
    (${origin}, destination, price, user_name, post_date, departure_date, departure_time, arrival_date, arrival_time, url, ts)
    ON CONFLICT (url) DO NOTHING;
    `
}

module.exports = {processScrapeRequest}
