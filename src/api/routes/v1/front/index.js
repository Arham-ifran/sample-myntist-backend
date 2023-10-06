const express = require('express')
const authRoutes = require('./auth.route')
const feedbackRoutes = require('./feedback.route')
const toolsRoutes = require('./tools.route')
const listingsRoutes = require('./listings.route')
const stakingsRoutes = require('./stakings.route')
const notificationRoutes = require('./notifications.routes')
const documentationRoutes = require('./documentation.route')
const router = express.Router()
/**
 * GET v1/status
 */
router.use('/auth', authRoutes)
router.use('/feedback', feedbackRoutes)
router.use('/tools', toolsRoutes)
router.use('/listings', listingsRoutes)
router.use('/stakings', stakingsRoutes)
router.use('/notifications', notificationRoutes)
router.use('/documentation', documentationRoutes)

module.exports = router
