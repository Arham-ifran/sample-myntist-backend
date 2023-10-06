const mongoose = require('mongoose')

/**
 * Rates Schema
 * @private
 */
const RatesSchema = new mongoose.Schema({
    BNBtoUSD:  { type: Number, default: 0 },
    WBNBtoUSD: { type: Number, default: 0 },
    MYNTtoUSD: { type: Number, default: 0 },
    WBNBtoBNB: { type: Number, default: 0 },
    MYNTtoBNB: { type: Number, default: 0 },
    BNBtoWBNB: { type: Number, default: 0 },
    ETHtoUSD:  { type: Number, default: 0 },
    WETHtoUSD: { type: Number, default: 0 },
    WETHtoETH: { type: Number, default: 0 },
    ETHtoWETH: { type: Number, default: 0 },
    MYNTtoETH: { type: Number, default: 0 }

}, { timestamps: true }
)

/**
 * @typedef Rates
 */

module.exports = mongoose.model('Rates', RatesSchema)