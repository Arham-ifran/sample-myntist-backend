const express = require('express');
const controller = require('../../../controllers/gamification/nfts.controller');
const router = express.Router();
const { createNftUploads } = require('../../../utils/upload')

router.route('/recent/:address').get(controller.getRecent); // API to get 5 most recent created NFTs of requested user
router.route('/collectibles/:address').get(controller.getRecentCollectibles); // API is to get the last 6 collectibles (i.e. created NFTs) of a given user.
router.route('/create').post(createNftUploads, controller.create); // create gamification nfts

module.exports = router;