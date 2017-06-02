//noinspection JSUnresolvedVariable
const assert       = require('assert'),
      path         = require('path'),
      crypto       = require('crypto'),
      _            = require('lodash'),
      Promise      = require('bluebird'),
      fs           = Promise.promisifyAll(require('fs-extra')),
      uuidV1       = require('uuid/v1'),
      git          = require('./git-repository'),
      genesis_id   = require('config').get('ledger').genesis_id,
      storageBlock = require('../config/storage-block.json');

const id2file = (id) => {
  return `${_.replace(id, 'did:', 'did_')}.json`;
};

const _findById = (id) => _findByFile(path.resolve(git.repo(), id2file(id)));

const _findByFile = (file) => {
  //noinspection JSUnresolvedFunction
  return fs
    .readJsonAsync(file)
    .catch(err => {
      console.error(err);
      throw new Error('id not found in db')
    });
};

const _appendBlock = (block) => {
  assert.ok(_.isString(block.id), 'the parameter should have an id');
  // noinspection JSUnresolvedFunction
  return fs
    .outputJsonAsync(path.resolve(git.repo(), id2file(block.id)), block)
    .then(() => console.log(`${block.id} has been written`))
    .then(() => {
      return block;
    });
};

const _adhereBlock = (block, previous) => {
  assert.ok(_.isString(previous.id), 'the previous block should have an id');
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(previous));
  block.previousBlock = {
    id  : previous.id,
    hash: `urn:sha256:${hash.digest('hex')}`
  };
  return block;
};

const _addBasicInfo = (claims) => {
  const block = storageBlock;
  block.id = `did:${uuidV1()}`;
  block.setObject = claims;
  return block
};

const _writeFromPrevious = (claims, parent) => {
  assert.ok(_.isArray(claims), 'the claims should be an array');

  const adhereBlock = _.curry(_adhereBlock)(_addBasicInfo(claims));

  return _findById(parent)
    .then(adhereBlock)
    .then(_appendBlock);
};

const appendBlock = (claims, parent) => {
  // noinspection JSUnresolvedVariable
  return parent ? _writeFromPrevious(claims, parent) : _writeFromPrevious(claims, genesis_id);
};

const fetchBlock = (id) => {
  return _findById(id);
};

const fetchFile = (file) => {
  return _findByFile(path.resolve(git.repo(), file));
};


module.exports = {
  appendBlock,
  fetchBlock,
  fetchFile
};
