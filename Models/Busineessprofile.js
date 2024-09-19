const mongoose = require('mongoose');
const { Schema } = mongoose;



const sampleSchema = new Schema ({
    companyName: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique:true },
    alternativePhoneNumber: { type: Number },
    emailId: { type: String, unique: true, required: true },
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
    accountType:{type:String},
    description: {type: String },
    services: { type: [String] },
    password: {
        type: String,
        required: "Your password is required",
        select: false,
        max: 25,
    },

},
{ timestamps: true },
{
    suppressReservedKeysWarning:true // suppress the warnig
}
);
sampleSchema.pre("save", function (next) {
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
sampleSchema.methods.generateAccessJWT = function () {
    let payload = {
      id: this._id,
    };
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
      expiresIn: '20m',
    });
  };
module.exports = mongoose.model("Businessprofile",sampleSchema)
