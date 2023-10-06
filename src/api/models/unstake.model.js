const mongoose = require('mongoose')

/**
 * This schema would have history of unstaked NFTs with other details
 * @private
 */
const UnstakeSchema = new mongoose.Schema({
    nftId: { type: mongoose.Schema.Types.ObjectId, ref: 'NFT', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // owner at time of unstaking NFT
    unstakeTxHash: { type: String },
    unstakeSign: { type: String }, // sign for unstaking NFT
    quantity: { type: Number, default: 1 }, // quantity of unstaked NFT(s)
}, { timestamps: true }
)

/**
 * @typedef Unstake
 */

module.exports = mongoose.model('Unstake', UnstakeSchema)
