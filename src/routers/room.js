const express = require("express");
const Room = require("../models/room");
const multer = require('multer');


const roomRouter = express.Router();



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        //fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});



roomRouter.post("/rooms", upload.single('photo'), async(req, res) => {
    try {
        const room = new Room({
            //_id: new mongoose.Types.ObjectId(),
            roomname: req.body.nama,
            roomdetail: req.body.detail,
            roomphoto: req.file.path,
            iduser: "test"
        });
        console.log(room);
        await room.save();
        res.status(201).json({
            message: "Created Room successfully",
            CreatedRoom: {
                roomname: room.roomname,
                roomdetail: room.roomdetail,
                _id: room._id,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/rooms/" + room._id
                }
            }
        })
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