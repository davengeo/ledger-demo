const assert       = require('assert'),
      express      = require('express'),
      path         = require('path'),
      logger       = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser   = require('body-parser'),
      _            = require('lodash'),
      memento      = require('./memento-init'),
      index        = require('../routes/index');

const app = express();
const wontLeakMessages = process.env.NODE_ENV === 'production';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.set('port', process.env.PORT || 3000);

const _isLegit = (route) => {
  return _.isString(_.get(route, 'route')) && _.isString(_.get(route, 'lib'));
};

const error_handlers = () => {

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res) => {
    // noinspection JSUnresolvedFunction
    res
      .status(err.status || 500)
      .json({
              message: wontLeakMessages ? 'reserved' : err.message,
              error  : wontLeakMessages ? 'reserved' : err.message,
              title  : 'error'
            })
      .end();
  });
};

const init = (routes) => {

  assert.ok(_.isObject(routes)
            && _.isArray(_.get(routes, 'dynamic'))
            && _.isArray(_.get(routes, 'static')),
            'the routes should be into an array');

  _.forEach(_.get(routes, 'dynamic'), route => {
    if (_isLegit(route)) {
      // noinspection JSUnresolvedVariable
      app.use(route.route, require(memento.pathFrom(route.lib)));
    }
  });

  _.forEach(_.get(routes, 'static'), publicDir =>
    app.use(express.static(publicDir)));

  _.forEach(_.get(routes, 'dynamic'), route => {
    if (_isLegit(route)) {
      // noinspection JSUnresolvedVariable
      app.use(route.route, require(memento.pathFrom(route.lib)));
    }
  });

  return Promise.resolve('Express OK');

};

module.exports = {
  init,
  app
};
