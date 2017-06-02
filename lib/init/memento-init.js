const path = require('path'),
      fs   = require('fs-extra');

let mementoPath = null;

const init = (path) => {
    // noinspection JSUnresolvedFunction
    if (!fs.existsSync(path)) {
        throw new Error(`path doesn't exist`);
    }
    mementoPath = path;
    return Promise.resolve('memento OK');
};

const hostedPackageJson = () => {
    if (!mementoPath) {
        throw new Error('library not initialized');
    }
    return require(path.resolve(mementoPath, 'package.json'));
};

const pathFrom = (from) => {
    if (!mementoPath) {
        throw new Error('library not initialized');
    }
    return path.resolve(mementoPath, from);
};

module.exports = {
    init,
    hostedPackageJson,
    pathFrom
};
