const express = require("express");
const Room = require("../models/room");
const multer = require('multer');
const auth = require("../middleware/auth");


const roomRouter = express.Router();


//multer setup output dan filename
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

//filter image only
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
//multer upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
});

//validasi admin role
const adminRole = (...roles) => { //...spread operator extrak isi array 
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return res.send(403) // error fobbriden
        }

        next();
    };
};

//upload photo

roomRouter.post("/rooms/upload", auth, adminRole('admin'), upload.single('photo'), (req, res, next) => {
    console.log(req.file);
    if (!req.file) {
        res.status(500);
        return next(Error);
    }
    res.status(201).json({
        message: "Upload Photo rooms successfully",
        pathphoto: req.file.path,
        ViewPhoto: {
            request: {
                type: 'GET',
                url: 'http://localhost:3000/uploads/' + req.file.filename
            }
        }
    })
})

//create rooms
roomRouter.post("/rooms/", auth, adminRole('admin'), async(req, res) => {
    try {
        const room = new Room({
            roomname: req.body.roomname,
            roomdetail: req.body.roomdetail,
            roomphoto: req.body.roomphoto,
            iduser: req.user._id
        });
        await room.save();
        res.status(201).json({
            message: "Created Room successfully",
            CreatedRoom: {
                _id: room._id,
                roomname: room.roomname,
                roomdetail: room.roomdetail,
                userid: room.userid,

                request: {
                    type: 'GET',
                    url: "http://localhost:3000/rooms/" + room._id
                }
            }
        });
    } catch (err) {
        res.status(400).send(err);
    }
});


// Update Room by ID
roomRouter.patch("/rooms/:id", auth, adminRole('admin'), async(req, res) => {
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
        room ? res.status(200).json({
            room,
            ViewPhoto: {
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/uploads/' + room.roomphoto
                }
            }
        }) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete rooms
roomRouter.delete("/rooms/:id", auth, adminRole('admin'), async(req, res) => {
    const room = await Room.findByIdAndDelete(req.params.id);
    try {
        room ? res.status(204).send(room) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});



// get all rooms
roomRouter.get("/rooms", async(req, res) => {
    const room = await Room.find({});
    if (room) {
        res.json(room);
    } else {
        res.status(404).json({ message: "room not found" });
    }
});

roomRouter.get("/rooms/:id", async(req, res) => {
    const _id = req.params.id;
    try {
        const room = await Room.findById(_id);
        room ? res.status(200).json({
            room,
            ViewPhoto: {
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/uploads/' + room.roomphoto
                }
            }
        }) : res.status(404).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = roomRouter;