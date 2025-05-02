const { json } = require('express');
const launchesDatabase = require('./lunches.mongo');
const planets = require('./planets.mongo');

const DESAULT_FLIGHT_NUMBER = 100;

async function existLaunchWithId(launchId) {
    return await launchesDatabase.findOne({
        flightNumber: launchId
    })
}


async function getLatestFlightNumbers(params) {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber')

    if (!latestLaunch) {
        return DESAULT_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber
}

async function getAllLaunches() {
    return await launchesDatabase.find({}, {
        '_id': 0,
        '__v': 0,
    })
}

async function savelaunch(launch) {

    try {
        const planet = await planets.findOne({
            'keplerName': launch.target
        })

        if (!planet) {
            throw new Error("No matching planet found");
        } else {
            await launchesDatabase.findOneAndUpdate({
                flightNumber: launch.flightNumber
            }, launch, {
                upsert: true,
            })
            return launch
        }
    } catch (error) {
        console.error(error)
        return {
            error: error.message
        }
    }

}

async function schudleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumbers() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcomming: true,
        customers: ["Nasa", "Spase x"],
        flightNumber: newFlightNumber
    })

    return await savelaunch(newLaunch)
}

function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(
        latestFlightNumber,
        Object.assign(launch,
            {
                flightNumber: latestFlightNumber,
                upcoming: true,
                success: true,
                customers: ["Fuad Hasan", "NASA"]
            }
        ));
}

async function abrotLaunchById(launchId) {
   const abroted = await launchesDatabase.updateOne({
        flightNumber: launchId,
    }, {
        upcomming: false,
        success: false,
    })
    return abroted.modifiedCount === 1;
}


module.exports = {
    existLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abrotLaunchById,
    schudleNewLaunch

}