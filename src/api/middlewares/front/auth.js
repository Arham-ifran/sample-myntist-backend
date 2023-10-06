const User = require("../../models/users.model");
const Admin = require("../../models/admin.model");
const CryptoJS = require("crypto-js");
const { pwEncryptionKey, frontEncSecret } = require("./../../../config/vars");
const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
  const { originalUrl = "", headers = null, token = "" } = req;

  if (originalUrl.indexOf("/v1/") > -1) {
    if (headers["x-auth-token"]) {
      const decryptedStr = headers["x-auth-token"];

      if (token) {
        const bytes = CryptoJS.AES.decrypt(token, decryptedStr);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        if (decryptedData !== frontEncSecret) {
          const message = "auth_request_required_front_error1";
          return res.status(405).json({ success: false, message });
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      next();
    }
  }
};

exports.userValidation = async (req, res, next) => {
  const { headers = null } = req;
  req.user = 0;

  let flag = true;
  if (headers["x-access-token"]) {
    await jwt.verify(
      headers["x-access-token"],
      pwEncryptionKey,
      async (err, authorizedData) => {
        if (err) {
          flag = false;
          const message = "Oops! Session expired";
          return res.send({ success: false, userDisabled: true, message, err });
        } else {
          req.user = authorizedData.sub;


          const user = await User.findById({ _id: req.user }).lean();
          if (!user) {
            flag = false;
            return res.status(401).send({
              success: false,
              user404: true,
              message: "There is no account linked to that address",
              notExist: 1,
            });
          }
        }
      }
    );
  }

  if (flag) next();
};
