const pool = require('../db')

/**
 * Create a new pin.
 * @param {Request} req 
 * @param {Response} res 
 */
const create = async (req, res) => {
	const { title, link } = req.body
	const author = req.user?.uid

	if (!author) {
		return res.json({
			error: "Auth failed."
		})
	}

	try {
		if (title && link) {
			const query_result = await pool.query(
				'INSERT INTO pin (title, link, author) VALUES ($1, $2, $3) RETURNING id;',
				[title, link, author]
			)
			res.json({
				message: "pin created.",
				payload: { pin_id: query_result.rows[0].id }
			})
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

/**
 * Get a pin using its id.
 * @param {Request} req
 * @param {Response} res
 */
const getPinById = async (req, res) => {
	const { id } = req.params
	console.log(req.params)

	try {
		const pid = parseInt(id)
		if (pid) {
			const query_result = await pool.query(
				'SELECT pin.id AS pid, title, link, username as author, created_on FROM pin INNER JOIN "user" ON "user".id=pin.author WHERE pin.id=$1;',
				[pid]
			)
			if (query_result.rowCount > 0) {
				const pin = query_result.rows[0]
				res.json(pin)
			} else {
				res.json({
					error: "Pin not found."
				})
			}
		} else {
			res.json({
				error: "Missing pin id."
			})
		}
	} catch (error) {
		res.json({
			error: "Something went wrong.",
			payload: error
		})
	}
}

/**
 * Get pins from the database.
 * @param {Request} req Request object
 * @param {Response} res Response object
 */
const getPins = async (req, res) => {
	const page = req.query.page || 1
	const limit = req.query.limit || 10

	if (page <= 0 || limit <= 0) {
		return res.json({
			error: "Invalid page or limit."
		})
	}

	const offset = (page-1) * limit
	
	try {
		const query_result = await pool.query(
			'SELECT pin.id AS pid, title, link, username as author, created_on FROM "user" INNER JOIN pin ON "user".id=pin.author ORDER BY created_on DESC LIMIT $1 OFFSET $2;',
			[limit, offset]
		)
		res.json(query_result.rows)
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

module.exports = { create, getPinById, getPins }