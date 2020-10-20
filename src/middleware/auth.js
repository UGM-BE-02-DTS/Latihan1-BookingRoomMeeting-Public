export {};
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "BE02");
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.user.token = token;
        next();
    } catch (err) {
        res.send({ error: "Please authenticate!" });
    }
};



module.exports = auth;
