const express = require("express");
const auth = require("../middleware/auth.js");
const Booking = require("../models/booking.js")

//1. buat crud dasar
//2.update ke auth dan role

const bookRouter = express.Router();


bookRouter.post("/booking-rooms", auth, async(req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).send({ booking });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update user by ID
bookRouter.patch("/booking-rooms/:id",auth, async(req, res) => {
    /*const updates = Booking.keys(req.body);
    const allowedUpdates = ["idroom", "judulMeeting", "tanggalMeeting", "sesi", "peserta"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send();
    }

    try {
        const booking = await Object.findById(req.params.id);
        updates.forEach((update) => (booking[update] = req.body[update]));

        await booking.save();
        booking ? res.status(200).send(booking) : res.status(404).send();
    } catch (err) {
        assert.isNotOk(error,'Promise error');
        done();
        res.status(500).send(err.message);
    }*/

    const {iduser, idroom, judulMeeting, tanggalMeeting, sesi, peserta} = req.body

    const booking = await Booking.findById(req.params.id)

    if (booking) {
        updateUser.iduser = iduser;
        updateUser.idroom = idroom;
        updateUser.judulMeeting = judulMeeting;
        updateUser.tanggalMeeting = tanggalMeeting;
        updateUser.sesi = sesi;
        updateUser.peserta = peserta;
 
        const booking = await booking.save()

        res.json(booking)

    }else {
        res.status(404).json({
            message: 'Data not found'
        })
    }
});


// Delete 
bookRouter.delete("/booking-rooms/:id",auth, async(req, res) => {
    /*const booking = await Booking.findByIdAndDelete(req.params._id);
    try {
        booking ? res.status(204).send(booking) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err);
    }*/

    const booking = await Booking.findById(req.params.id)

    if(booking) {
        await booking.remove()
        res.json({
            message: 'Data removed'
        })

    }else {
        res.status(404).json({
            message: 'Data not found'
        })
    }
});


// get all booking
bookRouter.get('/get-booking',auth, async(req, res) => {
    const booking = await Booking.find({})
    if (booking) {
        res.json(booking)
    } else {
        res.status(404).json({ message: 'room not found' })
    }
})

module.exports = bookRouter;