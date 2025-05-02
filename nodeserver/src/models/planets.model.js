const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}


async function loadHabitablePlanets() {
    return new Promise(async (resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)) {
                saveHabitablePlanet(data);
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', async() => {
            const habitablePlanets = (await getAllPlanets()).length;
            console.log(`${habitablePlanets} habitable planets found!`);
            resolve();
        });
    })

}

async function saveHabitablePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        });
    } catch (err) {
        console.error(`Could not save planet ${err}`);
    }
}
async function  getAllPlanets() {
    return await planets.find({}, {
        '_id': 0,
        '__v': 0
    });
}
function getPlanetById(planetId) {
    return habitablePlanets.find(planet => planet.kepler_name === planetId);
}


module.exports = {
    getAllPlanets,
    getPlanetById,
    loadHabitablePlanets,
    isHabitablePlanet
}