const mongoose = require('mongoose')

/**
 * Collection Schema
 * @private
 */
const CollectionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: { type: String, required: true },
    address: { type: String },
    nameLower: { type: String, required: true, lowercase: true },

    // imgs. with ipfs path
    logo: { type: String },
    featuredImg: { type: String },
    banner: { type: String },

    // imgs. saved on server
    logoLocal: { type: String },
    featuredImgLocal: { type: String },
    bannerLocal: { type: String },

    url: { type: String, required: true, unique: true, lowercase: true }, // slug
    description: { type: String, default: ""},
    siteLink: { type: String, default: "" },
    discordLink: { type: String, default: "" },
    instaLink: { type: String, default: "" },
    mediumLink: { type: String, default: "" },
    telegramLink: { type: String, default: "" },

    show: { type: Boolean, default: false, required: true },
    lastFetched: { type: Number, default: 0 },
    autoColId: { type: Number },

    isNotableDrop: { type: Boolean, default: false },
    giftCardsApplicable: { type: Boolean, default: true },

    forFundraising: { type: Boolean, default: false }, // shows either if collection is for fundraising or not
    forGamification: { type: Boolean, default: false },
    forTreasurebox: { type: Boolean, default: false },
    forMyntistAI: { type: Boolean, default: false },
    forDiscord: { type: Boolean, default: false }, // shows either if collection is for discord bot or not

    chainId: { type: Number },

    tokenStandard: { type: Number },

    lastFetchedBlock: { type: Number, default: 0 }

}, { timestamps: true }
)

/**
 * @typedef Collection
 */

module.exports = mongoose.model('Collection', CollectionSchema)