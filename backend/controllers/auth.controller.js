const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db')

const SECRET = process.env.SECRET

const signup = async (req, res) => {
	const { username, email, password } = req.body

	const first_name = req.body.first_name || ''
	const last_name = req.body.last_name || ''

	try {
		if (username && email && password) {

			const hash = await bcrypt.hash(password, 10)

			await pool.query(
				'INSERT INTO "user" (email, username, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5);',
				[email, username, first_name, last_name, hash]
			)
			
			res.json({
				message: "User registered successfully."
			})
		} else {
			res.json({
				error: "Required fields can not be empty."
			})
		}
	} catch (error) {
		switch(error.code) {
			case "23505":
				res.json({
					error: "Email or Username already exist."
				})
				break;
			default:
				res.json({
					error: "Something went wrong."
				})
		}
	}
}

const signin = async (req, res) => {
	const { username, password } = req.body

	try {
		if (username && password) {
			const query_result = await pool.query(
				'SELECT email, username, password FROM "user" WHERE username=$1;',
				[username]
			)

			if (query_result.rowCount > 0) {
				const user = query_result.rows[0]
				if (await bcrypt.compare(password, user.password)) {

					const token = jwt.sign(
						{ uid: user.id, username },
						SECRET,
						{ expiresIn: '24h' },
					)

					res.json({
						message: "Sinin was successfull.",
						payload: { token }
					})
				} else {
					res.json({
						error: "Wrong username or password."
					})
				}
			} else {
				res.json({
					error: "Wrong username or password."
				})
			}
		} else {
			res.json({
				error: "Required fields can not be empty."
			})
		}
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}


module.exports = { signup, signin }