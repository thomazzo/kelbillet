const { Pool } = require('pg')

const pool = new Pool()

function saveTickets(tickets) {
    pool.query('SELECT * FROM tickets')    

}
module.exports = {
    query: (text, params) => pool.query(text, params),
    saveTickets
}
