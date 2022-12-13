const express = require('express')
const router = express.Router()
const controller = require('../controller/controller')

router.get('/home', controller.render_home)

module.exports = router