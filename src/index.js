const express = require("express");
const morgan = require("morgan");
require("./db/mongoose");
const userRouter = require("./routers/user");
const roomRouter = require("./routers/room");
const bookRouter = require("./routers/booking");
const bodyParser = require("body-parser");
//const fileupload = require("express-fileupload");



const app = express();
const port = process.env.PORT || 3000;

//app.use(fileupload());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(morgan("dev"));
app.use(userRouter);
app.use(roomRouter);
app.use(bookRouter);


// tambah path router booking dimari

app.listen(port, () => {
    console.log("Server is up on port " + port);
});