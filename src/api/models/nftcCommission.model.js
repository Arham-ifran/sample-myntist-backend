const mongoose = require('mongoose')

/**
 * NFTC Commissions Schema - this collection would have all the commissions for NFTC
 * @private
 */
const NFTCCommissionSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nftcId: { type: mongoose.Schema.Types.ObjectId, ref: 'NFT', required: true }, // NFTC mongodb Id
    belongsTo: { type: mongoose.Schema.Types.ObjectId, ref: 'NFT', required: true }, // simple NFT Id
    platformShare: { type: Number }, // platform share for future sale of simple NFT
    commissions: { type: Array }, // other sellers commissions stored in sorted manner i.e. [cT1, cT2, ..., cTn]
    commissionNum: { type: Number }, // commission number for same NFTC i.e. 1, 2, ..., n
}, { timestamps: true }
)

/**
 * @typedef NFTCCommission
 */

module.exports = mongoose.model('NFTCCommission', NFTCCommissionSchema)