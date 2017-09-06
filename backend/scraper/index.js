const scraper = require('./scraper')

const CITY_IDS = {
    'Paris': [33210, 26687],
    'London': [26687, 33210]}

function processScrapeRequest(requestBody) {
    if(requestBody.origin && requestBody.selectedDate){
        const originId = CITY_IDS[requestBody.origin][0]
        const arrivalId = CITY_IDS[requestBody.origin][1]
        const selectedDate = requestBody.selectedDate
        const dateSplit = selectedDate.split('-')
        const departureDate = dateSplit[2] + '/'+ dateSplit[1] + '/' + dateSplit[0]
        const url = `http://www.kelbillet.com/recherche/recherche-billet.php?ville_depart_id=${originId}&ville_arrivee_id=${arrivalId}&date_aller=${departureDate}`
        scraper.scrapePage(url)
    }
    else {console.log('ooops')
    }
}

module.exports = {processScrapeRequest}
