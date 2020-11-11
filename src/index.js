const express = require("express");
const morgan = require("morgan");
require("./db/mongoose");
const userRouter = require("./routers/user");
const roomRouter = require("./routers/room");
const bookRouter = require("./routers/booking");
const bodyParser = require("body-parser");




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

//for testing
app.get('/', (req, res, next) => {
    res.json({
        message: 'success'
    })
})

// tambah path router booking dimari

app.listen(port, () => {
    console.log("Server is up on port " + port);
});