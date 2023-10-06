const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const jwt = require("jwt-simple");
const {
  pwdSaltRounds,
  jwtExpirationInterval,
  pwEncryptionKey,
  baseUrl,
} = require("../../config/vars");

/**
 * User Schema
 * @private
 */
const UserSchema = new mongoose.Schema(
  {
    type: { type: Number }, // 1 = Creator, 2 = User or Buyer or Owner
    username: { type: String, default: "Unnamed" },
    description: { type: String },

    // imgs. with ipfs path
    profileImage: { type: String },
    badgeImage: { type: String },
    bannerImage: { type: String },

    // imgs. saved on server
    profileImageLocal: { type: String },
    badgeImageLocal: { type: String },
    bannerImageLocal: { type: String },

    address: { type: String },
    facebookLink: { type: String },
    twitterLink: { type: String },
    gPlusLink: { type: String },
    vineLink: { type: String },
    signature: { type: String },

    referralId: { type: String },
    referredBy: { type: mongoose.Schema.Types.ObjectId },

    forFundraising: { type: Boolean, default: false }, // shows either if user is for fundraising or not
    forGamification: { type: Boolean, default: false },
    forTreasurebox: { type: Boolean, default: false },
    forMyntistAI: { type: Boolean, default: false },

    isInvestor: { type: Boolean, default: false }, // shows user purchased NFT from myntist fundraiser

    discordId: { type: String }, // users who connect their discord account with marketplace

    tokensUsed: { type: Number, default: 0 }, // number of tokens used by a user for AI interface

    customerId: { type: String }, //for myntis ai front stripe payment
  },
  { timestamps: true }
);

/**
 * Methods
 */
UserSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "_id",
      "email",
      "address",
      "description",
      "facebookLink",
      "gPlusLink",
      "profileImage",
      "profileImageLocal",
      "bannerImage",
      "bannerImageLocal",
      "twitterLink",
      "username",
      "vineLink",
      "referralId",
      "referredBy",
      "isInvestor",
      "discordId",
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    // assigning server path for images
    transformed.profileImage = transformed.profileImageLocal
      ? `${baseUrl}${transformed.profileImageLocal}`
      : "";
    transformed.bannerImage = transformed.bannerImageLocal
      ? `${baseUrl}${transformed.bannerImageLocal}`
      : "";

    delete transformed.profileImageLocal;
    delete transformed.bannerImageLocal;

    return transformed;
  },

  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, "minutes").unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, pwEncryptionKey);
  },
});

UserSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * @typedef User
 */

module.exports = mongoose.model("User", UserSchema);
