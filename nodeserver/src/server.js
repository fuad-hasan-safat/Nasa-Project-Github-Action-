const http = require("http");
const app = require("./app");
const { mongoConnect } = require('./services/mongo');
const { loadHabitablePlanets } = require("./models/planets.model");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


const start = async () => {
    try {
        await mongoConnect();
        await loadHabitablePlanets();
        server.listen(PORT, () => {
            console.log(`Nasa project Server is running on port ${PORT} and mongoose running`)
        })



    } catch (error) {
        console.error(error);
        console.log("MONGOOSE ERROR")
        process.exit(1);
    }
};

start();

// startServer();
