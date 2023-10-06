const mongoose = require('mongoose');

/**
 * NFT Schema
 * @private
 */
const NFTSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    owners: { type: Array, default: [] },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    currentPrice: { type: Number },
    currency: { type: String },
    txHash: { type: String },
    sold: { type: Number, default: 0 }, // count for how many times NFT was sold
    copies: { type: Number, default: 0 }, // count for total no. of copies
    status: { type: Number, default: 1 }, // 1 = Idle, 2 = On Sale
    sellingMethod: { type: Number }, // 1 = Fixed Price, 2 = Timed Auction
    sellingConfig: { type: Object },
    auctionStartDate: { type: Date }, // start date for auction or fixed price
    auctionEndDate: { type: Date }, // end date for auction or fixed price
    auctionStartTime: { type: String },
    auctionEndTime: { type: String },
    metaData: { type: String }, // ipfs link
    tokenId: { type: String },
    attributes: { type: Array, default: [] },
    isCustom: { type: Boolean, default: false },
    address: { type: String },
    autoNftId: { type: Number },
    ownerVerification: { type: Boolean, default: false },
    createdSign: { type: String }, // sign for creating NFT
    sellingSign: { type: String }, // sign for selling NFT
    cancelListingSign: { type: String }, // sign for cancel listing NFT
    mediaType: { type: Number, default: 1 }, // 1 = Images, setting default for images

    image: { type: String }, // thumbnails for media (images, pdfs, ppts..etc) saved with ipfs
    imageLocal: { type: String }, // thumbnails saved on server

    file: { type: String }, // nft files ( audio, video, pdfs,.etc) save with ipfs
    fileLocal: { type: String }, // nft files saved on server

    type: { type: Number, default: 1, required: true }, // 1 = Simple NFT, 2 = NFTC

    belongsTo: { type: mongoose.Schema.Types.ObjectId, ref: 'NFT' }, // it represents original NFT Id. This is not for Simple NFT

    // these are for simple NFT
    platformShare: { type: Number }, // platform share for future sale of simple NFT
    commissions: { type: Array }, // other sellers commissions stored in sorted manner i.e. [cT1, cT2, ..., cTn]
    nftcId: { type: Number }, // NFTC Id to sort NFTCs of same NFT i.e. 1, 2, ..., n

    isBlocked: { type: Boolean, default: false },

    showInHomePage: { type: Boolean, default: false },
    showInEarningSection: { type: Boolean, default: false },

    rights: { type: Number, default: 1 }, // rights management, 1 = Contribution, 2 = Exclusivity, 3 = Non-Exclusive

    tokenStandard: { type: Number, default: 1 }, // 1 = ERC721, 2 = ERC1155

    forFundraising: { type: Boolean, default: false }, // shows either if category is for fundraising or not

    // attributes for Gamification NFTs
    forGamification: { type: Boolean, default: false },
    gNFTType: { type: Number }, // 1 = badge, 2 = avatar

    chainId: { type: Number },

    isGiftCardApplicable: { type: Boolean, default: true },
}, { timestamps: true }
);

/**
 * @typedef NFT
 */

module.exports = mongoose.model('NFT', NFTSchema);