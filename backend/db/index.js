const { pool } = require('pg')

module.exports = {
    query: (text, params) => pool.query(text, params)
}
