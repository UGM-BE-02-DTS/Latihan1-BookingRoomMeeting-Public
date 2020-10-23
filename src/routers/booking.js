const express = require("express"),
const Booking = require("../models/booking.js")

//1. buat crud dasar
//2.update ke auth dan role

const bookRouter = express.Router();


bookRouter.post("/booking-rooms", async(req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).send({ room });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update user by ID
bookRouter.patch("/booking-rooms/:id", async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["iduser", "idroom", "judulMeeting", "tanggalMeeting", "sesi", "peserta"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send();
    }

    try {
        const booking = await Booking.findById(req.params.id);
        updates.forEach((update) => (booking[update] = req.body[update]));

        await booking.save();
        booking ? res.status(200).send(booking) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Delete 
bookRouter.delete("/booking-rooms/:id", async(req, res) => {
    const booking = await Booking.findByIdAndDelete(req.params._id);
    try {
        user ? res.status(204).send(booking) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err);
    }
});


// get all rooms
bookRouter.get('/get-booking', async(req, res) => {
    const booking = await Booking.find({})
    if (booking) {
        res.json(booking)
    } else {
        res.status(404).json({ message: 'room not found' })
    }
})

module.exports = bookRouter;