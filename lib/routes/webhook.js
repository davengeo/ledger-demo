const express    = require('express'),
      R          = require('ramda'),
      Promise    = require('bluebird'),
      git        = require('../git-repository'),
      ledger     = require('../web-ledger'),
      warehouse  = require('../warehouse'),
      commonResp = require('../init/common-responses');

const router = express.Router();

const _sendOk = (res) => {
  return res.status(200).end()
};

const _processFile = (file) => {
  return ledger
    .fetchFile(file)
    .then(warehouse.accept);
};

const _processCommits = (res, commits) => {

  console.log(commits[0]);

  const files = R.reduce(R.concat, [], R.map(R.prop('added'), commits));

  const ps = git
    .pull()
    .then(() => R.map(_processFile, files));

  Promise
    .all(ps)
    .then(() => git.push())
    .then(() => _sendOk(res))
    .catch((err) => {
      console.error(err);
      return _sendOk(res);
    })
};


router.post('/', (req, res) => {

  const payload        = req.body,
        processCommits = R.curry(_processCommits)(res);

  //this is a PING
  if (R.prop('zen', payload)) {
    return _sendOk(res);
  }

  //this is a PUSH
  if (R.prop('commits', payload)) {
    return processCommits(R.prop('commits', payload));
  }

});


module.exports = router;
