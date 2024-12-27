const express  = require("express");
const config = require("config");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");

const port = config.get("port");
const mainRouter = require("./routes/index.routes");
const error_handling_middleware = require("./error_middleware/error_handling_middleware");
const logger = require("./services/logger.service");
const winston = require("winston")
const expressWinston = require("express-winston")

// require("dotenv").config({
//     path:`.env.${process.env.NODE_ENV}`
// });

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);

// console.log(config.get("secret"));


// process.on("uncaughtException", (exception) =>{
//     console.log("uncaughtException occured", exception.message);
// });

// process.on("unhandledRejection", (rejection) =>{
//     console.log("unhandledRejection occured", rejection);
// })


logger.log("info", "Log")
logger.error("Error")
logger.debug("Debug")
logger.warn("Warn")
logger.info("Info")





const app = express();


app.use(express.json());
app.use(cookieParser());


app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        // winston.format.colorize(),
        winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

app.use("/api", mainRouter);

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        // winston.format.colorize(),
        winston.format.json()
    )
}));

app.use(error_handling_middleware) /// eng oxirida yozilishi kerak


async function start() {
    try {
        await mongoose.connect(config.get("dbAtlasUri"));
        app.listen(port, () =>{
            console.log(`Server running: http://localhost:${port}`);
        });
    } catch (error) {
        console.log("Error occurred while connecting to db")
    }
}

start();








