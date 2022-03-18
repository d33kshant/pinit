const { verify } = require('../controllers/auth.controller')
const { create, getPinById } = require('../controllers/pin.controller')

const router = require('express').Router()

router.post('/', verify, create)
router.get('/:id', getPinById)


module.exports = router