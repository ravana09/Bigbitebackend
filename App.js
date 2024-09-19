const express = require("express")
const cookieParser = require('cookie-parser');

const APP_SERVER = express();


APP_SERVER.use(cookieParser());
APP_SERVER.use("/User",require("./Routes/Loginroute"))
APP_SERVER.use("/Laund",require("./Routes/Laundroute"))
APP_SERVER.use("/Nearloc",require("./Routes/Nearbylovroute"))
APP_SERVER.use("/Business",require("./Routes/Business"))
APP_SERVER.use("/Upload",require("./Routes/Uploadimage"))
APP_SERVER.use("/Service",require("./Routes/Servicer"))
APP_SERVER.use("/Review",require("./Routes/Reviewr"))
APP_SERVER.use(require("./Routes/Businesssignupr"))
APP_SERVER.use(require('./Routes/Usersignupr'))

module.exports = APP_SERVER;

