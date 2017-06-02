//noinspection SpellCheckingInspection
const express     = require('express'),
      R           = require('ramda'),
      Promise     = require('bluebird'),
      git         = require('../git-repository'),
      groups      = require('../semantic-groups'),
      Git         = require('nodegit'),
      committer   = R.prop('committer', require('config').get('repository')),
      mementoHost = require('../init/memento-init'),
      commonResp  = require('../init/common-responses');

const router = express.Router();

router.post('/push', (req, res) => {
  git
    .pull()
    .then(() => groups.init())
    .then(() => git.push())
    .then(() => commonResp.ok(res, 'OK pushed'))
    .catch(err => {
      console.error(err);
      commonResp.serverError(res, err)
    });
});

router.post('/pull', (req, res) => {
  let repoGit = null;
  git
    .pull()
    .then(() => groups.init())
    .then(() => commonResp.ok(res, 'OK synced'))
    .catch(err => {
      console.error(err);
      commonResp.serverError(res, err)
    });

});

module.exports = router;
