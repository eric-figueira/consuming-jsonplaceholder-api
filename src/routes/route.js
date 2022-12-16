const express = require('express')
const router = express.Router()
const controller = require('../controller/controller')

router.get('/home', controller.render_home)
router.get('/profile/:username', controller.render_profile)

module.exports = router