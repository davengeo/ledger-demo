const R       = require('ramda'),
      Promise = require('bluebird'),
      parts   = require('config').get('bootstrap');

const loadUnit = (params, part) => {

  const paramName = R.prop('param', part);

  if (paramName && R.prop(paramName, params)) {
    return require(R.prop('lib', part)).init(R.prop(paramName, params))
  } else {
    return require(R.prop('lib', part)).init()
  }
};

function loadInParallel(params, flag) {
  return Promise
    .each(
      R.map(R.curry(loadUnit)(params), R.prop(flag, parts)),
      (value, index) => {
        console.log(`${index} ${JSON.stringify(value)} => loaded`);
      });
}

const init = (params) => {
  return loadInParallel(params, 'pre')
    .then(() => console.info('======= pre initialized ======='))
    .then(() => loadInParallel(params, 'post'))
    .then(() => console.info('====== post initialized ======='))
};

module.exports = {
  init
};
