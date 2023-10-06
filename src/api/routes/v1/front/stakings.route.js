const express = require('express')
const controller = require('../../../controllers/front/stakings.controller')
const router = express.Router()

router.route('/list').get(controller.list)

module.exports = router