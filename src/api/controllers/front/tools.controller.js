const axios = require('axios')
const {
    BNBtoUSDLink,
    WBNBtoUSDLink,
    MYNTtoUSDLink,
    WBNBtoBNBLink,
    MYNTtoBNBLink,
    BNBtoWBNBLink,
    ETHtoUSDLink,
    WETHtoUSDLink,
    WETHtoETHLink,
    ETHtoWETHLink,
    MYNTtoETHLink,
    priceConversionHeaders
} = require('../../../config/vars')
const Rates = require('../../models/rates.model')

// API to get rates for different tokens
exports.getRates = async (req, res, next) => {
    try {
        const rates = await Rates.findOne({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean(true)
        if (rates)
            return res.json({ success: true, ...rates })
        else {
            const newRates = await convertPrice()
            if (newRates?.success)
                return res.json({ ...newRates })
        }
    } catch (error) {
        next(error)
    }
}

exports.upsertRates = async (req, res, next) => {
    try {
        const result = await convertPrice()
        if (result?.success)
            return res.json(result)
    } catch (error) {
        next(error)
    }
}

const convertPrice = async () => {
    try {
        // convert price for X to Y
        // Binance Rates
        const BNBtoUSD = await convertXtoY('USD', BNBtoUSDLink)
        const WBNBtoUSD = await convertXtoY('USD', WBNBtoUSDLink)
        const MYNTtoUSD = await convertXtoY('USD', MYNTtoUSDLink)
        const WBNBtoBNB = await convertXtoY('BNB', WBNBtoBNBLink)
        const MYNTtoBNB = await convertXtoY('BNB', MYNTtoBNBLink)
        const BNBtoWBNB = await convertXtoY('WBNB', BNBtoWBNBLink)
    
        // Ethereum Rates
        const ETHtoUSD = await convertXtoY('USD', ETHtoUSDLink)
        const WETHtoUSD = await convertXtoY('USD', WETHtoUSDLink)
        const WETHtoETH = await convertXtoY('ETH', WETHtoETHLink)
        const ETHtoWETH = await convertXtoY('WETH', ETHtoWETHLink)
        const MYNTtoETH = await convertXtoY('ETH', MYNTtoETHLink)

        const result = await Rates.findOneAndUpdate({}, {
            $set: {
                BNBtoUSD,
                WBNBtoUSD,
                MYNTtoUSD,
                WBNBtoBNB,
                MYNTtoBNB,
                BNBtoWBNB,
                ETHtoUSD,
                WETHtoUSD,
                WETHtoETH,
                ETHtoWETH,
                MYNTtoETH
            }
        }, {
            upsert: true,
            new: true
        })

        const rates = result.toObject()

        // delete unwanted values
        delete rates._id
        delete rates.createdAt
        delete rates.updatedAt
        delete rates.__v

        return ({
            success: true,
            ...rates
        })
    } catch (error) {
        return error
    }
}

// method to convert X to Y
const convertXtoY = async (to, url) => {
    try {
        const res = await axios.get(url, priceConversionHeaders)
        const { data } = res.data
        return data[0]?.quote[to]?.price || 0
    } catch (error) {
        return { success: false, message: error }
    }
}

// shared method to get given token - utils
const getConvertedTokens = async (givenKeys = []) => {
    const keys = {}

    givenKeys.map((key) => {
        keys[key] = 1
    })

    const rates = await Rates.findOne({}, { _id: 0, ...keys }).lean(true)
    if (rates)
        return rates

    return false
}

exports.getConvertedTokens = getConvertedTokens