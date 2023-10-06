const User = require('../../models/users.model');
const { verifySign } = require('../../utils/web3')
const randomize = require('randomatic');
/**
 * Returns jwt token if valid address and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { boady: { address, password, referredBy } } = req;

    const user = await User.findOne({ address }).exec();

    // create user if user not found, and then login
    if (!user) {
      let referralId = `${Date.now().toString(36)}${randomize('Aa0', 10)}`;
      const userData = {
        username: 'Unnamed',
        address,
        signature: password,
        referralId
      }

      const referredByUser = {}
      if (referredBy) {
        referredByUser = await User.findOne({ referralId: referredBy });
        if (referredByUser)
          userData.referredBy = referredByUser._id
        else
          return res.status(400).send({ success: false, message: 'Referrer does not exist' })
      }

      let newUser = await User.create(userData)
      const accessToken = await newUser.token();

      newUser = newUser.transform();

      if (referredByUser && referredByUser.address)
        newUser.referredByAddress = referredByUser.address

      const data = {
        ...newUser,
        accessToken
      }

      return res.status(200).send({ status: true, message: 'User logged in successfully', data: { ...data, newUser: true } });
    }
    // log in valid user 
    else if (user) {
      // check if user has provided valid signature
      const web3SignRes = await verifySign(address, password)
      if (!web3SignRes)
        return res.status(400).send({ status: false, message: 'Incorrect OR Missing Credentials' });

      const accessToken = await user.token();
      user = user.transform();
      const data = {
        ...user,
        accessToken
      }

      return res.status(200).send({ status: true, message: 'User logged in successfully', data });
    }
  } catch (error) {
    return next(error);
  }
};

