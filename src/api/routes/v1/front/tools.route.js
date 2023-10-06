const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/front/tools.controller')

router.route('/price-conversion').get(controller.getRates)
router.route('/upsert-rates').get(controller.upsertRates) // API for CRON to upsert rates for different tokens

module.exports = router