const express = require('express');
const { 
    httpaddNewLaunch,
    httpgetAllLaunches,
    httpAbortLaunch
 } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpgetAllLaunches);
launchesRouter.post('/', httpaddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;