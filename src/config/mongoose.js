const mongoose = require('mongoose');
const { mongo: { uri: mongoUri = '' }, env } = require('./vars');

// Exit application on error
mongoose.connection.on('error', () => {
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
  mongoose.set('debug', true);
}

/**
* Connect to mongo db
*
* @returns {object} Mongoose connection
* @public
*/
exports.connect = () => {
  mongoose.connect(mongoUri, {
    keepAlive: 1,
  });
  return mongoose.connection;
};
