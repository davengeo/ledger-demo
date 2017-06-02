const assert  = require('assert'),
      path    = require('path'),
      config  = require('config'),
      Promise = require('bluebird'),
      R       = require('ramda');

let storage = {};

const add = (block, group) => {
  assert.ok(R.is(String)(group), 'group should be a string');
  const existingGroup = R.find(R.equals(group))(R.keys(storage));
  if (existingGroup) {
    R.prop(existingGroup)(storage).push(block);
  } else {
    storage = R.assoc(group, [block])(storage);
  }
};

const _reduce = (fn, init, group) => {
  if (!R.is(String)(group) || R.isNil(R.prop(group)(storage))) {
    return 0;
  }
  return R.reduce(fn, init, R.prop(group)(storage));
};

const sum = (group) => {
  return _reduce((acc, {claim: {value: value}}) => acc + value, 0, group);
};

const clear = () => {
  storage = [];
};

module.exports = {
  add,
  sum,
  clear
};
