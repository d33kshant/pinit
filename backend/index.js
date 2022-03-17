require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const pool = require('./db')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())

app.post('/signup', async (req, res) => {
	const { username, email, password } = req.body

	const first_name = req.body.first_name || ''
	const last_name = req.body.last_name || ''

	try {
		if (username && email && password) {

			const hash = await bcrypt.hash(password, 10)

			const query_result = await pool.query(
				'INSERT INTO "user" (email, username, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5);',
				[email, username, first_name, last_name, hash]
			)
			
			res.json({
				code: 200,
				message: "User registered successfully."
			})
		} else {
			res.json({
				code: 400,
				message: "Required fields can not be empty."
			})
		}
	} catch (error) {
		switch(error.code) {
			case "23505":
				res.json({
					code: 400,
					message: "Email or Username already exist."
				})
				break;
			
			default:
				res.json({
					code: 500,
					message: "Something went wrong.",
					payload: error
				})
		}
	}
})

pool.connect().then(res=>{
	app.listen(PORT, async () => {
		console.log('Server listening on port:', PORT)
	})
})