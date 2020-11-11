const express = require("express");
const auth = require("../middleware/auth.js");
const Room = require("../models/meeting")

const bookRouter = express.Router();


// Create Booking
bookRouter.patch("/booking-room/:id", auth, async(req, res) => {
    try {
        const bookingRoom = await Room.findById(req.params.id);
        bookingRoom.booking = true,
            bookingRoom.meetingtitle = req.body.tittle,
            bookingRoom.meetingDetail = req.body.detail,
            bookingRoom.userid = auth.token

        await bookingRoom.save();
        bookingRoom ? res.status(200).send(bookingRoom) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//avaible room
bookRouter.get("/avaible-room", auth, async(req, res) => {
    const match = { booking: false };
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        await req.user
            .populate({
                path: "rooms",
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort,
                },
            })
            .execPopulate();
        req.user.rooms ? res.send(req.user.rooms) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message)
    }
});

// get all booking
bookRouter.get('/get-bookings', auth, async(req, res) => {
    const match = { booking: true };
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        await req.user
            .populate({
                path: "rooms",
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort,
                },
            })
            .execPopulate();
        req.user.rooms ? res.send(req.user.rooms) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = bookRouter;