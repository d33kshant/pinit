require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./db')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
	const result = await pool.query("SELECT * FROM \"user\";")
	res.json(result.rows)
})

pool.connect().then(res=>{
	app.listen(PORT, async () => {
		console.log('Server listening on port:', PORT)
	})
})