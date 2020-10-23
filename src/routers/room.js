const express = require("express");
const Room = require("../models/room");


const roomRouter = express.Router();

roomRouter.post("/rooms", async(req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).send({ room });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update user by ID
roomRouter.patch("/rooms/:id", async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["roomname", "roomdetail", "roomphoto"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send();
    }

    try {
        const room = await Room.findById(req.params.id);
        updates.forEach((update) => (room[update] = req.body[update]));

        await room.save();
        room ? res.status(200).send(room) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }

});


// Delete rooms
roomRouter.delete("/rooms:id", async(req, res) => {
    const room = await Room.findByIdAndDelete(req.params._id);
    try {
        user ? res.status(204).send(room) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err);
    }
});


// get all rooms
roomRouter.get('/rooms', async(req, res) => {
    const room = await Room.find({})
    if (room) {
        res.json(room)
    } else {
        res.status(404).json({ message: 'room not found' })
    }
})

module.exports = roomRouter;