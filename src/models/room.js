const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomname: {
        type: String,
        required: [true, "Please input room name!"]
    },
    roomdetail: {
        type: String,
        required: [true, "Please input room detail!"]
    },
    roomphoto: {
        type: String, //string dulu ntar di update 
        required: [true, "Please upload room photo!"]
    },
    iduser: {
        type: String, //tambah untuk history yang input
        required: [true, "Please relogin!"] // gak perlu kayak nya cuma tambahin aja
    }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;