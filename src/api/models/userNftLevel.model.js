const mongoose = require('mongoose')

/**
 * This schema would have simple NFT level info.
 * @private
 */
const UserNftLevelSchema = new mongoose.Schema({
    nftId: { type: mongoose.Schema.Types.ObjectId, ref: 'NFT', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // buyer at the time of purchasing / future seller Id
    level: { type: Number, default: 1 }, // level of NFT
}, { timestamps: true }
)

/**
 * @typedef UserNftLevel
 */

module.exports = mongoose.model('UserNftLevel', UserNftLevelSchema)
