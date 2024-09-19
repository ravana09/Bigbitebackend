
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;

const UserSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            max: 25,
        },
        phoneNumber: {
            type: String,
        },
        alternativeNumber: { type: Number },
        emailId: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        accountType:{
           type:String,
           default:"Business"
        },
        password: {
            type: String,
            select: false,
            max: 25,
        },
    address: { type: String },
    website: { type: String },
    gstNo: { type: String },
    startTime: { type: String },
    endTime: { type: String },  
    instagram: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    whatsapp: { type: String },
    youtube: { type: String },
    about: { type: String },
    yearOfEstablishment: { type: String },
    leaveDays: { type: String },
    accountType:{type:String,default:"Business"},
    description: {type: String },
    services:[{
      serviceName:{type:String} 
    }],

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
 
  module.exports= mongoose.model("businesssignup", UserSchema);

