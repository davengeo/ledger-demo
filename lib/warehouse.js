const R       = require('ramda'),
      Promise = require('bluebird'),
      ledger  = require('./web-ledger');

const subscribers = ['david', 'christos', 'christian', 'dirk'];


const appendDelivery = (block) => {
  const claim = R.path(['setObject', 0, 'claim'], block);
  claim.verb = 'delivery';
  return ledger
    .appendBlock([{ claim, tm: new Date().getTime(), recipient: R.path(['setObject', 0, 'recipient'], block)}],
                 R.prop('id', block))
    .then(() => R.identity(block));
};


const appendConsume = (block) => {
  const claim = R.path(['setObject', 0, 'claim'], block);
  claim.verb = 'consume';
  return ledger
    .appendBlock([{ claim, tm: new Date().getTime(), recipient: 'warehouse'}],
                 R.prop('id', block))
    .then(() => R.identity(block));
};

const accepted = (block) => {
  console.log('accepted!');
  console.log(JSON.stringify(block));
  return appendDelivery(block)
    .then(appendConsume);
};

const accept = (block) => {
  if (R.contains(R.path(['setObject', 0, 'recipient'], block), subscribers)
      && R.equals(R.path(['setObject', 0, 'claim', 'verb'], block), 'order')) {
    return accepted(block);
  }
};

module.exports = {
  accept
};
