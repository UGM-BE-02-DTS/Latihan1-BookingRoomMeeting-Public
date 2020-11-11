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
        type: String,
        required: [true, "Please upload room photo!"]
    },
    iduser: {
        type: String,
        required: [true, "Please relogin!"]
    },
    booking: {
        type: Boolean,
        default: false
    },
    reference: {
        type: String,
        default: "any",
        ref: "User",
    },
    meetingdate: {
        type: String,
        trim: true,
        required: [true, "Please tell your date meeting!"],
    },
    session: {
        type: String,
        trim: true,
        required: [true, "Please tell your session!"],
    },
    meetingdetail: {
        type: String,
        trim: true,
        default: "any",
    },
    meetingtitle: {
        type: String,
        trim: true,
        default: "any",
    },



}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;