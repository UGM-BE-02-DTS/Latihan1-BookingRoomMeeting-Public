const jwt = require("jsonwebtoken");
const User = require("../models/user");

//AUTHENTIKASI
const auth = async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        // console.log(token);
        const decoded = jwt.verify(token, "kunci"); //JANGAN LUPA UPDATE KE DYNAMIC SECRET
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