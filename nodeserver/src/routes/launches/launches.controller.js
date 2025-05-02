const { 
    getAllLaunches, 
    abrotLaunchById,
    schudleNewLaunch,
    existLaunchWithId,
} = require("../../models/launches.model");


async function httpgetAllLaunches(req, res) {
    try {
        return res.status(200).json( await getAllLaunches());
    } catch (error) {
        console.error('Error fetching launches:', error);
        return res.status(500).json({ error: 'Failed to fetch launches' });
    }
}

async function httpaddNewLaunch(req, res) {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({ 
            ok: false,
            error: 'Missing required launch property' });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({ error: 'Invalid launch date, date formate is January 14, 2030' });
    }
   const data = await schudleNewLaunch(launch);
    return res.status(201).json(data);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    const existLaunch = await existLaunchWithId(launchId)
    if (!existLaunch) {
        return res.status(400).json({ error: 'Invalid launch ID' });
    }
    const aborted = await abrotLaunchById(launchId);
    if (!aborted) {
        return res.status(400).json({ error: 'Launch not aborted' });
    }
    return res.status(200).json({
        ok: true
    });
}

module.exports = {
    httpgetAllLaunches,
    httpaddNewLaunch,
    httpAbortLaunch
};