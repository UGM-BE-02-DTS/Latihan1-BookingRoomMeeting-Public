const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SECRET } = require("../config.js");

const kunci = SECRET.config;

const auth = async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        // console.log(token);
        const decoded = jwt.verify(token, kunci);
        // console.log(decoded);
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });
        // console.log(user);
        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.user.token = token;
        next();
    } catch (err) {
        res.send({ error: "Please authenticate!" }); //di suruh relogin
    }
};

module.exports = auth;