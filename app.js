const express  = require("express");
const config = require("config");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");

const port = config.get("port");
const mainRouter = require("./routes/index.routes");
const error_handling_middleware = require("./error_middleware/error_handling_middleware");
const exHbs = require("express-handlebars");
const viewRouter = require("./routes/view.routes");

const hbs = exHbs.create({
    defaultLayout:"main",
    extname: "hbs" // handlebars ni qisqa yozilishi
});






const app = express();


app.use(express.json());
app.use(cookieParser());

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs")
app.set("views", "./views")
app.use(express.static("views"));


app.use("/", viewRouter);  // frontend
app.use("/api", mainRouter); // backend

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








