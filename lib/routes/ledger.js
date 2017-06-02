const express    = require('express'),
      _          = require('lodash'),
      ledger     = require('../web-ledger'),
      groups     = require('../label-groups'),
      semGroups  = require('../semantic-groups'),
      commonResp = require('../init/common-responses'),
      router     = express.Router();


const _isLegit = (request) => {
    return _.isString(_.get(request, 'claim.verb'))
        && _.isString(_.get(request, 'claim.name'))
        && _.isNumber(_.get(request, 'claim.value'))
        && _.isString(_.get(request, 'recipient'));
};

const _sendResponse = (res, block) => {
    // noinspection JSUnresolvedFunction
    return res
        .status(201)
        .json({
                  message: 'block appended',
                  block_id: block.id
              })
        .end()
};

const _calculateGroup = (requested) => {
    return semGroups.groupName(_.get(requested, 'recipient'),
                               _.get(requested, 'claim.name'),
                               _.get(requested, 'claim.verb'));
};

router.get('/:id', (req, res) => {
    const requestedId = _.get(req.params, 'id');

    if (!requestedId) {
        commonResp
            .notFound(res, 'id not present')
    }

    const handleError = _.curry(commonResp.serverError)(res);

    ledger
        .fetchBlock(requestedId)
        .then(block => {
            // noinspection JSUnresolvedFunction
            res
                .status(200)
                .json(block)
                .end(handleError);
        })
        .catch(handleError);
});

router.post('/', (req, res) => {

    const requested    = req.body,
          handleError  = _.curry(commonResp.serverError)(res),
          sendResponse = _.curry(_sendResponse)(res);

    let parent = null;

    if (!_isLegit(requested)) {
        return commonResp.badRequest(res, 'claim is not legit');
    }

    if (_.get(requested, 'parent')) {
        parent = _.get(requested, 'parent');
        // noinspection JSUnresolvedVariable
        delete requested.parent;
    }

    return ledger
        .appendBlock([_.extend(requested, {tm: new Date().getTime()})], parent)
        .then((block) => {
            groups.add(_.pick(requested, 'claim'), _calculateGroup(requested));
            return block;
        })
        .then(sendResponse)
        .catch(handleError);
});

module.exports = router;
