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
				'SELECT pin.id AS pid, title, link, username, created_on FROM pin INNER JOIN "user" ON "user".id=pin.author WHERE pin.id=$1;',
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

module.exports = { create, getPinById }