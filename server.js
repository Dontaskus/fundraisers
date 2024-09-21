const express = require('express');
const app = express();
const fundraiser = require("./apis/controller");
app.use("/api", fundraiser);
app.listen(5060);
console.log("Listenin to api calls at port 5060....")

