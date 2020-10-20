const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true,"Please tell your name!"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true,"Please input your password"],
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
        enum: ['user', 'admin'],
        default: 'user'
      },
    password: {
        type: String,
        required: [true,"Please input password"],
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw Error("Your passowrd is invalid!");
            }
        },
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }
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

userSchema.methods.generateAuthToken = async function (this) {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "BE02", {
        expiresIn: "7 days",
    });

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.methods.toJSON = function (this) {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens

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

userSchema.pre("save", async function (this, next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
