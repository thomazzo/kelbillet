const request = require('request')
const cheerio = require('cheerio')

function scrapePage(url){
    return request.get(url, (err, res, body) =>  {
        parsePage(body)})
}

function parsePage(pageBody) {

    const $ = cheerio.load(pageBody)
    let tickets = []
    $('.kb-search-result-content-offer, .kb-search-result-content-offer-occasion, .ligne').each((i, elem) => {
        const price = $(elem).attr('prix')	
        const user = $(elem).find('.kb-search-result-content-offer-occasion-membre-avatar').parent().text().match(/(\d\d\/\d\d).*\s(\w\w*\w)\s/)
        const timeLocation  =$(elem).find('.heure').text().match(/(\d\d:\d\d)\s+([\w\s]*\w)\s\s+(\d\d:\d\d)\s+(\w.*)/)
        const link = $(elem).find('.infos, .train').attr('href')
        if(price && user && timeLocation && link) {
            const ticket = {
                price: price,
                userName: user[2],
                postDate: user[1],
                departure: timeLocation[2],
                departureTime: timeLocation[1],
                arrival: timeLocation[4],
                arrivalTime: timeLocation[3],
                link: link
            }
            if(tickets.filter((t) => t.link == link).length == 0) {
                tickets.push(ticket)
            }
        }
    })
    return tickets
}

module.exports = {scrapePage}
