const mongoose = require('mongoose')

/**
 * This schema would have staking details if NFT is staked
 * @private
 */
const StakeSchema = new mongoose.Schema({
    nftId: { type: mongoose.Schema.Types.ObjectId, ref: 'NFT', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stakingDate: { type: Date }, // date for staking a NFT
    stakingDays: { type: Number }, // no. of days for staking a NFT
    stakingPrice: { type: String },
    stakeTxHash: { type: String },
    stakeId: { type: String },
    stakeIndex: { type: String },
    stakeSign: { type: String }, // sign for staking NFT
    quantity: { type: Number, default: 1 }, // quantity of staked NFT(s)
}, { timestamps: true }
)

/**
 * @typedef Stake
 */

module.exports = mongoose.model('Stake', StakeSchema)
