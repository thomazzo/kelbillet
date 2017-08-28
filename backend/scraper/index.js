const request = require('request')
const cheerio = require('cheerio')

function getPage(){
    return request.get('http://www.kelbillet.com/recherche/recherche-billet.php?depart=Londres&arrivee=Paris&ville_depart_id=33210&ville_arrivee_id=26687&date_aller=20%2F08%2F2017', (err, res, body) =>  {parsePage(body)})
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
    console.log(tickets)
}
getPage()
