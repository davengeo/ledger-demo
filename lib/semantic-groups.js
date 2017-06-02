const path     = require('path'),
      R        = require('ramda'),
      Promise  = require('bluebird'),
      groups   = require('./label-groups'),
      fs       = Promise.promisifyAll(require('fs-extra')),
      git      = require('./git-repository'),
      BASE_POS = 1,
      RST_POS  = 2;

const groupName = (actor, name, verb) => {
  return R.join('.', [actor, name, verb]);
};

const concepts = {
  inventory: [R.subtract, 'delivery', 'consume'],
  capacity : [(acc, x) => x + acc, 'inventory', 'delivery-promise']
};

const _resolveBasic = (actor, name, verb) => {
  return groups.sum(groupName(actor, name, verb))
};

const _resolveConcept = (actor, name, verb) => {
  const members   = R.prop(verb)(concepts),
        toResolve = R.curry(_resolve)(actor)(name),
        fn        = R.head(members),
        first     = toResolve(R.nth(BASE_POS, members)),
        rest      = R.map(toResolve, R.drop(RST_POS, members));

  return R.reduce(fn, first, rest);
};

const _resolve = (actor, name, verb) => {
  if (R.has(verb)(concepts)) {
    return _resolveConcept(actor, name, verb);
  } else {
    return _resolveBasic(actor, name, verb);
  }
};

const wrap = (actor, name, verb) => {
  return Promise.resolve(_resolve(actor, name, verb))
};

const _addBlock = (file) => {
  // noinspection JSUnresolvedFunction
  return fs
    .readJsonAsync(path.resolve(git.repo(), file))
    .then(obj => {
      const block = R.path(['setObject', 0])(obj),
            group = groupName(
              R.path(['setObject', 0, 'recipient'])(obj),
              R.path(['claim', 'name'], block),
              R.path(['claim', 'verb'], block));
      if (block && group) {
        return groups.add(block, group);
      }
    })
    .catch(console.error);
};

//noinspection JSUnresolvedFunction
const onlyJson = R.filter(R.endsWith('.json'));

const init = () => {

  groups.clear();
  //noinspection JSUnresolvedFunction
  return fs.readdirAsync(git.repo())
           .then(onlyJson)
           .then((file) => R.forEach(_addBlock)(file))
           .then((blocks) => `${blocks.length} blocks added to index OK`)
           .catch(err => {
             console.error(err);
             process.abort();
           });

};

module.exports = {
  groupName,
  resolve: wrap,
  init
};


