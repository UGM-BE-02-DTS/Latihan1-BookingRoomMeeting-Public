const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please tell your name!"],
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Please input your password"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error("Please provide a valid email address!");
            }
        },
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 15) {
                throw Error("Your age is not enough!");
            }
        },
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Please input password"],
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw Error("Your password is invalid!");
            }
        },
    },
    passwordConfirm: {
        type: String,
        required: [false, "Please confirm your password"],
        validate(value) {
            // This only works on CREATE and SAVE!!!
            if (this.password !== this.passwordConfirm) {
                return true;
            }
        },
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "BE02", {
        expiresIn: "7 days",
    });

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.passwordConfirm;
    delete userObject.password;

    delete userObject.tokens;

    return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw "Unable to login";
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw "Unable to login";
    }

    return user;
};

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
        user.passwordConfirm = await bcrypt.hash(user.passwordConfirm, 8);
    }
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
