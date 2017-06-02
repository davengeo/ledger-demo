const wontLeakMessages = process.env.NODE_ENV === 'production';

const badRequest = function (res, reason) {
    // noinspection JSUnresolvedFunction
    res
        .status(400)
        .json({
                  message: 'request not accepted',
                  reason: wontLeakMessages ? 'reserved' : reason
              })
        .end();
};

const noAccess = function (res, reason) {
    // noinspection JSUnresolvedFunction
    res
        .status(401)
        .json({
                  message: 'no access',
                  reason: wontLeakMessages ? 'reserved' : reason
              })
        .end();
};

const notFound = function (res, reason) {
    // noinspection JSUnresolvedFunction
    res
        .status(404)
        .json({
                  message: 'not found',
                  reason
              })
        .end();
};

const ok = function (res, value) {
    // noinspection JSUnresolvedFunction
    res
        .status(200)
        .json(value)
        .end();
};

const serverError = function (res, err) {
    // noinspection JSUnresolvedFunction
    res
        .status(500)
        .json({
                  message: 'server error',
                  reason: wontLeakMessages ? 'reserved' : err
              })
        .end();
};

module.exports = {
    badRequest,
    noAccess,
    serverError,
    notFound,
    ok
};
