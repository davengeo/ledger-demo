const express     = require('express'),
      packageJson = require('../init/memento-init').hostedPackageJson(),
      router      = express.Router();

router.get('/', (req, res) => {
    // noinspection JSUnresolvedFunction
    res
        .status(200)
        .json({message: packageJson.name})
        .end();
});

router.get('/info', (req, res) => {
    // noinspection JSUnresolvedFunction
    res
        .status(200)
        .json({
                  build: {
                      version: packageJson.version,
                      artifact: packageJson.description,
                      name: packageJson.name,
                      group: "com.tme",
                      time: new Date().getTime()
                  }
              })
        .end();
});


const health = (res) => {
    // noinspection JSUnresolvedFunction
    res
        .status(200)
        .json({status: "UP"})
        .end();
};

router.get('/health', (req, res) => {
    health(res);
});

router.get('/health.json', (req, res) => {
    health(res);
});

module.exports = router;
