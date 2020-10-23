const mongoose = require('mongoose');

//buat model booking
//samain kayak rancangan database design
//kalau udah ok buat branch baru push
const bookSchema = new mongoose.Schema({
    iduser: {
        type: String,
        trim: true,
        required: [true, "Please input your id!"],
    },
    idroom: {
        type: String,
        trim: true,
        required: [true, "Please input your id room"],
    },
    judulmeeting: {
        type: String,
        trim: true,
        required: [true, "Please tell your topic meeting!"],
    },
    tanggalmeeting: {
        type: Date,
        trim: true,
        required: [true, "Please tell your date meeting!"],
    },
    sesi: {
        type: String,
        trim: true,
        required: [true, "Please tell your sesi!"],
    },
    peserta: {
        type: String,
        trim: true,
        required: [true, "Please tell your peserta!"],
    },

});

const Booking = mongoose.model('Room', bookSchema);

module.exports = Booking;