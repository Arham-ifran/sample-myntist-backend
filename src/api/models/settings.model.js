const mongoose = require("mongoose");

/**
 * Settings Schema
 * @private
 */
const SettingsSchema = new mongoose.Schema(
  {
    email: { type: String, default: "" },
    mobile: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    discord: { type: String, default: "" },
    twitter: { type: String, default: "" },
    youtube: { type: String, default: "" },
    instagram: { type: String, default: "" },
    medium: { type: String, default: "" },
    telegram: { type: String, default: "" },
    reddit: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    facebook: { type: String, default: "" },
    pinterest: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    royality: { type: Number, default: 0, required: true },
    share: { type: Number, default: 0, required: true },
    desc: { type: String, default: "" },
    domain: { type: String, default: "" },
    api: { type: String, default: "" },
    paymentTokens: {
      type: Object,
      default: {
        currency: {
          type: String,
          default: "",
        },
        chainId: {
          type: Number,
        },
      },
    },
    totalNfts: { type: Number, default: 0 }, // total NFTs created through our platform
    totalCols: { type: Number, default: 0 }, // total collections created through our platform
    paypalClientId: { type: String },
    paypalClientSecret: { type: String },

    // royalty split & comission % for Simple NFT
    royaltySplit: { type: Number, default: 0.1 }, // first sale commission goes to marketplace % i.e. s0 = 10%
    initialSellerPercent: { type: Number, default: 0.9 }, // initial seller % for selling their product i.e. sI = 90%
    firstComission: { type: Number, default: 0.6 }, // commission % to be paid to the first seller i.e. 60%

    // royalty split & comission % for NFTC
    royaltySplitC: { type: Number, default: 0.1 }, // first sale commission goes to marketplace % i.e. s0 = 10%
    initialSellerPercentC: { type: Number, default: 0.9 }, // initial seller % for selling their product i.e. sI = 90%
    firstComissionC: { type: Number, default: 0.6 }, // commission % to be paid to the first seller i.e. 60%

    webhookSecret: { type: String }, // for stripe
    stripeFrontKey: { type: String }, // stripe client side key
    stripeServerKey: { type: String }, //stripe server side key
  },
  { timestamps: true }
);

/**
 * @typedef Settings
 */

module.exports = mongoose.model("Settings", SettingsSchema);
