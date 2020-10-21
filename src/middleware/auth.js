const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        // console.log(token);
        const decoded = jwt.verify(token, "BE02");
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
        res.send({ error: "Please authenticate!" });
    }
};

module.exports = auth;
