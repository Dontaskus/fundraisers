const express = require('express');
const app = express();
const fundraiser = require("./apis/controller");
app.use("/api", fundraiser);
app.listen(8080);
console.log("Listenin to api calls at port 8080....")

