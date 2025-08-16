var postgres = require('postgres')
var dotenv = require('dotenv')

dotenv.config()

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

module.exports = sql