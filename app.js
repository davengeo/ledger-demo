require('./lib/init/bootstrap')
  .init({
          memento   : __dirname,
          routes    : require('config').get('routes'),
          repository: require('config').get('repository')
        })
  .then(() => {
    const app    = require('./lib/init/express-init').app,
          server = app.listen(app.get('port'), () => {
            console.log('Server listening on port ' + server.address().port);
          });
  });

