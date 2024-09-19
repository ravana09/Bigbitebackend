const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: "Your name is required",
            max: 25,
        },
        contactNumber: {
            type: String,
            required:"Contact number is required",
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        account_type:{
           type:String,
           default:"self"
        },
        password: {
            type: String,
            required: "Your password is required",
            select: false,
            max: 25,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});
UserSchema.methods.generateAccessJWT = function () {
    let payload = {
      id: this._id,
    };
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
      expiresIn: '20m',
    });
  };
const User= mongoose.model("Usersignup", UserSchema);
module.exports=User;
