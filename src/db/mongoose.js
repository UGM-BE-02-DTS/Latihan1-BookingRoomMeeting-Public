const mongoose = require("mongoose");
const { mongoURI } = require("../config");

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    // autoIndex: true

});