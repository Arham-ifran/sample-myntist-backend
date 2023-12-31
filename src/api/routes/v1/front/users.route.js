const express = require('express');
const controller = require('../../../controllers/front/users.controller');
const router = express.Router();
const { profileUpload } = require('../../../utils/upload')

router.route('/').post(controller.create);
router.route('/').put(profileUpload, controller.update);
router.route('/creators').get(controller.getCreators);
router.route('/top-sellers').get(controller.topSellers);
router.route('/list-trade').get(controller.listTrade);
router.route("/discord").post(controller.discord);
router.route('/:userId').get(controller.getUser);

module.exports = router;