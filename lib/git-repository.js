const assert      = require('assert'),
      R           = require('ramda'),
      Promise     = require('bluebird'),
      fs          = Promise.promisifyAll(require('fs-extra')),
      Git         = require('nodegit'),
      mementoHost = require('./init/memento-init'),
      committer   = R.prop('committer', require('config').get('repository'));

let repoPath = null;

const credentials = {
  callbacks: {
    credentials     : (url, username) => {
      return Git.Cred.sshKeyNew(
        username,
        mementoHost.pathFrom('config/id_rsa.pub'),
        mementoHost.pathFrom('config/id_rsa'),
        '');
    },
    certificateCheck: () => {
      return 1;
    }
  }
};

const init = (params) => {
  repoPath = mementoHost.pathFrom(R.prop('local', params));
  fs.removeSync(repoPath);

  //noinspection JSUnresolvedFunction
  return Git
    .Clone(R.prop('remote', params), repoPath, {fetchOpts: credentials})
    .then(() => "Git repository cloned")
    .catch(err => {
      console.error(err);
      process.abort();
    })
};

const repo = () => {
  assert.ok(!R.isNil(repoPath), 'git repo has not been initialized');
  return repoPath;
};

const client = () => {
  //noinspection JSUnresolvedVariable
  return Git
    .Repository
    .open(repoPath);
};

const pull = () => {
  let repoGit = null;
  return client()
    .then(repo => {
      repoGit = repo;
      return repo.fetchAll(credentials);
    })
    .then(() => repoGit.mergeBranches('master', 'origin/master'));
};

const push = () => {
  let repoGit  = null,
      indexGit = null,
      oidGit   = null,
      files    = [];

  return client()
    .then(repo => {
      repoGit = repo;
      return repo.getStatus();
    })
    .then((statuses) => {
      R.forEach((st) => {
        if (st.isNew()) {
          files.push(st.path());
        }
      }, statuses);
      if (R.isEmpty(files)) {
        throw new Error('nothing to push');
      }
    })
    .then(() => repoGit.refreshIndex())
    .then((index) => {
      indexGit = index;
      const promises = [];
      R.forEach((file) => promises.push(indexGit.addByPath(file)), files);
      return promises;
    })
    .then((pr) => Promise.all(pr))
    .then(() => indexGit.write())
    .then(() => indexGit.writeTree())
    .then((oid) => {
      oidGit = oid;
      //noinspection JSUnresolvedVariable
      return Git.Reference.nameToId(repoGit, "HEAD")
    })
    .then((head) => repoGit.getCommit(head))
    .then((parent) => {
      //noinspection JSUnresolvedVariable
      const author = Git.Signature.now(committer.name, committer.email);
      return repoGit.createCommit("HEAD", author, author, `commit from ${committer.name}`, oidGit, [parent])
    })
    .then(() => {
      return repoGit.getRemote(`origin`);
    })
    .then((remote) => {
      return remote
        .push(['refs/heads/master:refs/heads/master'], credentials);
    })
};


module.exports = {
  init,
  repo,
  client,
  pull,
  push
};
