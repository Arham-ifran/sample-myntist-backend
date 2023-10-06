const fs = require('fs')
const ObjectId = require('mongoose').Types.ObjectId
const NFT = require('../../models/nfts.model')
const User = require('../../models/users.model')
const Collection = require('../../models/collection.model')
const Category = require('../../models/categories.model')
const Owners = require('../../models/owners.model')
const Settings = require('../../models/settings.model')
const UserNftLevel = require('../../models/userNftLevel.model')
const { addImage, addContent, downloadFile, uploadOnIPFS } = require('../../utils/upload')
const { frontBaseUrl, baseUrl, blockChains, gamificationPlaceholder, gamificationNFTMediaTypes, categoryDefaultImage, myntistContractAddressBNB, tinifyAPIKey } = require('../../../config/vars')
const { insert } = require('../../utils/activity')
const tinify = require("tinify")
tinify.key = tinifyAPIKey;

exports.getRecent = async (req, res, next) => {
    try {
        const { address } = req.params;

        if (!address)
            return res.status(400).send({ success: false, message: 'User wallet address is required' })
        else {
            const user = await User.findOne({ address });

            if (!user)
                return res.status(400).send({ success: false, message: "We've explored deep and wide but we're unable to find the user you're looking for" })
            else {
                const nfts = await NFT.aggregate([
                    {
                        $match: {
                            isBlocked: false,
                            creatorId: ObjectId(user._id)
                        }
                    },
                    { $sort: { createdAt: -1 } },
                    { $limit: 20 },
                    {
                        $lookup: {
                            from: 'bids',
                            foreignField: 'nftId',
                            localField: '_id',
                            as: 'bids'
                        }
                    },
                    {
                        $lookup: {
                            from: 'offers',
                            foreignField: 'nftId',
                            localField: '_id',
                            as: 'offers'
                        }
                    },
                    {
                        $lookup: {
                            from: 'stakes',
                            foreignField: 'nftId',
                            localField: '_id',
                            as: 'stakedNft'
                        }
                    },
                    {
                        $project: {
                            _id: 1, name: 1, description: 1,
                            address: { $ifNull: ['$address', null] },
                            image: { $ifNull: ['$image', gamificationPlaceholder] },
                            imageLocal: { $ifNull: [{ $concat: [baseUrl, '$imageLocal'] }, gamificationPlaceholder] },
                            currentPrice: { $ifNull: ['$currentPrice', null] },
                            auctionEndDate: { $ifNull: ['$auctionEndDate', null] },
                            currency: { $ifNull: ['$currency', null] },
                            statusType: '$status',
                            status: {
                                $cond: [
                                    { $eq: ['$status', 2] }, 'On Sale', 'Idle'
                                ]
                            },
                            currentBid: { $ifNull: [{ $arrayElemAt: ['$bids.price', -1] }, null] },
                            currentOffer: { $ifNull: [{ $arrayElemAt: ['$offers.price', -1] }, null] },
                            baseUrl: { $concat: [baseUrl, 'item-details/'] },
                            nftType: {
                                $cond: [
                                    { $eq: ['$type', 2] },
                                    {
                                        $cond: [{ $ne: ['$stakedNft', []] }, { class: 1, name: 'NFTCD' }, { class: 2, name: 'NFTC' }]
                                    },
                                    {
                                        $cond: [{ $ne: ['$stakedNft', []] }, { class: 3, name: 'NFTD' }, { class: 4, name: 'NFT' }]
                                    }
                                ]
                            }
                        }
                    },
                ])

                const createdNfts = await NFT.countDocuments({ creatorId: ObjectId(user._id) })

                return res.send({
                    success: true, message: 'Most recent NFTs created by user are fetched successfully',
                    nfts,
                    viewAll: `${baseUrl}author/${user._id}`,
                    createdNfts
                })
            }
        }
    } catch (error) {
        return next(error)
    }
}

exports.getRecentCollectibles = async (req, res, next) => {
    try {
        const { address } = req.params;

        if (!address)
            return res.status(400).send({ success: false, message: 'User wallet address is required' })
        else {
            const user = await User.findOne({ address });

            if (!user)
                return res.status(400).send({ success: false, message: "We've explored deep and wide but we're unable to find the user you're looking for" })
            else {
                const nfts = await NFT.aggregate([
                    {
                        $match: {
                            isBlocked: false,
                            ownerId: ObjectId(user._id)
                        }
                    },
                    { $sort: { createdAt: -1 } },
                    { $limit: 6 },
                    {
                        $lookup: {
                            from: 'stakes',
                            foreignField: 'nftId',
                            localField: '_id',
                            as: 'stakedNft'
                        }
                    },
                    {
                        $project: {
                            _id: 1, name: 1,
                            address: { $ifNull: ['$address', null] },
                            image: { $ifNull: ['$image', gamificationPlaceholder] },
                            imageLocal: { $ifNull: [{ $concat: [baseUrl, '$imageLocal'] }, gamificationPlaceholder] },
                            currentPrice: { $ifNull: ['$currentPrice', null] },
                            auctionEndDate: { $ifNull: ['$auctionEndDate', null] },
                            currency: { $ifNull: ['$currency', null] },
                            statusType: '$status',
                            status: {
                                $cond: [
                                    { $eq: ['$status', 2] }, 'On Sale', 'Idle'
                                ]
                            },
                            nftType: {
                                $cond: [
                                    { $eq: ['$type', 2] },
                                    {
                                        $cond: [{ $ne: ['$stakedNft', []] }, { class: 1, name: 'NFTCD' }, { class: 2, name: 'NFTC' }]
                                    },
                                    {
                                        $cond: [{ $ne: ['$stakedNft', []] }, { class: 3, name: 'NFTD' }, { class: 4, name: 'NFT' }]
                                    }
                                ]
                            }
                        }
                    },
                ])

                return res.send({
                    success: true, message: 'Most recent NFTs created by user are fetched successfully',
                    nfts,
                    viewAll: `${baseUrl}author/${user._id}`
                })
            }
        }
    } catch (error) {
        return next(error)
    }
}