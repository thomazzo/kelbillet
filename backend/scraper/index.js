const scraper = require('./scraper')
const models = require('../db/models')

const ROUTE_IDS = {
    'Paris-London': [33210, 26687],
    'London-Paris': [26687, 33210]}

async function processScrapeRequest(requestBody) {
    const route = requestBody.route 
    const selectedDate = requestBody.selectedDate

    if(route && selectedDate){
        const originId = ROUTE_IDS[route][0]
        const arrivalId = ROUTE_IDS[route][1]
        const kelbilletDate = convertDate(selectedDate)
        const url = `http://www.kelbillet.com/recherche/recherche-billet.php?ville_depart_id=${originId}&ville_arrivee_id=${arrivalId}&date_aller=${kelbilletDate}`

        const newTickets = await scraper.scrapePage(url)
        saveNewTickets(newTickets)
        return newTickets
    }
    else {
        return {}
    }
}

function convertDate(dateString) {
    const dateSplit = dateString.split('-')
    const departureDate = dateSplit[2] + '/'+ dateSplit[1] + '/' + dateSplit[0]
    return departureDate
}

function saveNewTickets(newTickets, route) {
    for(let ticket of newTickets) {
        models.tickets.findOrCreate({
            where:{
                link: ticket.link
            },
            defaults: {
                route: route,
                price: ticket.price,
                userName: ticket.userName,
            }
        })    
    }
}

module.exports = {
    processScrapeRequest
}
