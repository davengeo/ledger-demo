const express    = require('express'),
      R          = require('ramda'),
      semGroups  = require('../semantic-groups'),
      commonResp = require('../init/common-responses'),
      router     = express.Router();


router.get('/:actor', (req, res) => {

    const actor = R.prop('actor', req.params),
          name  = R.prop('name', req.query),
          verb  = R.prop('verb', req.query);

    if (!actor || !name || !verb) {
        commonResp
            .badRequest(res,
                        'actor, verb and name should be present in the request');
    }


    const ok          = R.curry(commonResp.ok)(res),
          handleError = R.curry(commonResp.serverError)(res);

    return semGroups
        .resolve(actor, name, verb)
        .then(ok)
        .catch(handleError);
})
;

module.exports = router;