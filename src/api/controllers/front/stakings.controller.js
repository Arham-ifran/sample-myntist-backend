const ObjectId = require('mongoose').Types.ObjectId
const Stakings = require('../../models/stake.model')

// API to get stakings list
exports.list = async (req, res, next) => {
    try {
        let { page, limit, nftId } = req.query

        if (!nftId)
            return res.status(400).send({ success: false, message: 'Item Id is required' })

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        const { stakings, total } = await getStakings(nftId, page, limit, true)

        return res.send({
            success: true, message: 'Stakings fetched successfully',
            data: {
                stakings,
                pagination: {
                    page, limit, total,
                    pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                }
            }
        })
    } catch (error) {
        return next(error)
    }
}

// shared method to get stakings
const getStakings = async (nftId, page = 1, limit = 1, getTotal = false) => {
    try {
        const filter = { nftId: ObjectId(nftId) }

        let total = 0
        if (getTotal)
            total = await Stakings.countDocuments(filter)

        const stakings = await Stakings.aggregate([
            { $match: filter },
            {
                $project: {
                    ownerId: 1, stakingDays: 1, stakeId: 1, stakeIndex: 1, stakingDate: 1, stakingPrice: 1, stakeTxHash: 1, quantity: 1, createdAt: 1
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'ownerId',
                    as: 'owner'
                }
            },
            {
                $project: {
                    owner: {
                        $cond: [
                            { $ne: ['$owner', []] },
                            {
                                _id: { $arrayElemAt: ['$owner._id', 0] },
                                username: { $arrayElemAt: ['$owner.username', 0] },
                                address: { $arrayElemAt: ['$owner.address', 0] }
                            },
                            null
                        ]
                    },
                    stakingDays: 1, stakeId: 1, stakeIndex: 1, stakingDate: 1, stakingPrice: 1, stakeTxHash: 1, quantity: 1
                }
            }
        ])

        const result = {
            stakings
        }

        if (getTotal)
            result.total = total

        return { ...result }
    } catch (error) {
        return false
    }
}

exports.getStakings = getStakings

// get total qty. for a staked NFT by user
const getStakingsQty = async (nftId, ownerId) => {
    try {
        const totalStaked = await Stakings.aggregate([
            {
                $match: {
                    nftId: ObjectId(nftId),
                    ownerId: ObjectId(ownerId)
                }
            },
            {
                $group: {
                    _id: null,
                    quantity: { $sum: '$quantity' }
                }
            }
        ])

        if (totalStaked?.length)
            return totalStaked[0].quantity

        return false
    } catch (error) {
        return false
    }
}

exports.getStakingsQty = getStakingsQty

const getLeastPriceStaking = async (nftId, ownerId) => {
    try {
        const staking = await Stakings.aggregate([
            {
                $match: {
                    nftId: ObjectId(nftId),
                    ownerId: ObjectId(ownerId)
                }
            },
            {
                $group: {
                    _id: null,
                    minStakingPrice: {
                        $min: { $divide: [{ $toDouble: '$stakingPrice' }, '$quantity'] }
                    }
                }
            }
        ])

        if (staking?.length)
            return staking[0].minStakingPrice

        return false
    } catch (error) {
        return false
    }
}

exports.getLeastPriceStaking = getLeastPriceStaking