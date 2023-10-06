const ObjectId = require('mongoose').Types.ObjectId
const Owners = require('../../models/owners.model')
const { userDefaultImage, baseUrl } = require('../../../config/vars')

exports.getOwners = async (nftId, userId = 0) => {
    try {
        const list = await Owners.aggregate([
            {
                $match: { nftId: ObjectId(nftId) }
            },
            {
                $sort: { createdAt: -1 }
            },
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
                    _id: 0,
                    copies: 1,
                    listed: 1,
                    owner: {
                        $cond: [
                            { $ne: ['$owner', []] },
                            {
                                _id: { $arrayElemAt: ['$owner._id', 0] },
                                username: { $arrayElemAt: ['$owner.username', 0] },
                                address: { $arrayElemAt: ['$owner.address', 0] },
                                profileImage: { $ifNull: [{ $concat: [baseUrl, { $arrayElemAt: ['$owner.profileImageLocal', 0] }] }, userDefaultImage] },
                            },
                            null
                        ]
                    }
                }
            }
        ])

        const total = list.length

        let ownedByYou = 0, // copies owned by you
            listedByYou = 0, // copies listed by you
            isOwner = false
        if (userId && total) {
            const res = await list.find((item) => String(item.owner._id) === String(userId))
            if (res) {
                ownedByYou = res.copies
                listedByYou = res.listed
                isOwner = true
            }
        }

        return { total, ownedByYou, listedByYou, isOwner, list }
    }
    catch (error) {
        return false
    }
}

exports.getCollectionOwners = async (collectionId) => {
    try {
        const list = await Owners.aggregate([
            {
                $match: { collectionId: ObjectId(collectionId) }
            },
            {
                $lookup: {
                    from: 'nfts',
                    foreignField: '_id',
                    localField: 'nftId',
                    as: 'nft'
                }
            },
            {
                $match: { 'nft.isBlocked': false }
            },
            {
                $sort: { createdAt: -1 }
            },
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
                    _id: 0,
                    copies: 1,
                    ownerId: 1,
                    owner: {
                        $cond: [
                            { $ne: ['$owner', []] },
                            {
                                _id: { $arrayElemAt: ['$owner._id', 0] },
                                username: { $arrayElemAt: ['$owner.username', 0] },
                                address: { $arrayElemAt: ['$owner.address', 0] },
                                profileImage: { $ifNull: [{ $concat: [baseUrl, { $arrayElemAt: ['$owner.profileImageLocal', 0] }] }, userDefaultImage] },
                            },
                            null
                        ]
                    },
                }
            },
            {
                $group: {
                    _id: '$ownerId',
                    owner: { $first: '$owner' },
                    totalNftsOwned: { $sum: 1 }
                }
            },
            {
                $project: { _id: 0 }
            }
        ])

        return { list }
    }
    catch (error) {
        return false
    }
}