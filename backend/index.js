require('dotenv').config()
const express = require('express')
const cors = require('cors')

const pool = require('./db')

const authRoute = require('./routes/auth.route')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoute)

pool.connect().then(res=>{
	app.listen(PORT, async () => {
		console.log('Server listening on port:', PORT)
	})
})