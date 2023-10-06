const Offer = require('../../models/offer.model')
const { insert } = require('../../utils/activity')
const { sendNotification } = require('../../utils/sendNotifications')

// API to create offer
exports.create = async (req, res, next) => {
    try {
        const { body: payload } = req;
        payload.offerBy = req.user;

        const offer = await Offer.create(payload)

        // notify user offer is placed
        const socket = req.app.get('socket');
        const notificationData = { nftId: payload.nftId, notificationFrom: offer.offerBy, notificationTo: payload.ownerId, type: 3 }
        sendNotification(socket, notificationData)

        insert({ userId: req.user, toUserId: payload.ownerId, nftId: payload.nftId, type: 2, price: payload.price.amount, currency: payload.price.currency, collectionId: payload.collectionId })

        return res.send({ success: true, message: 'You have made offer successfully', offer })
    } catch (error) {
        return next(error)
    }
}

// API to delete offer
exports.delete = async (req, res, next) => {
    try {
        const { params: { offerId } } = req
        if (offerId) {

            const offer = await Offer.deleteOne({ _id: offerId })
            if (offer?.deletedCount)
                return res.send({ success: true, message: 'Your Offer has been cancelled successfully' })
            else return res.status(400).send({ success: false, message: 'Offer not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'Offer Id is required' })
    } catch (error) {
        return next(error)
    }
}