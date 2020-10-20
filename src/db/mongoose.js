const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/booking-room-meeting", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    // autoIndex: true
});
