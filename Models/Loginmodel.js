const mongoose = require("mongoose")
const { Schema} = mongoose

const sampleSchema = new Schema ({
    name : {type:String}, 
    phonenumber :{type:Number,required: true, unique: true},
    email:{type:String,required: true, unique: true},
    password:{type:String},
    confirmpassword:{type:String},

},
{
    suppressReservedKeysWarning:true // suppress the warnig
}
);
module.exports = mongoose.model("Userlogincol",sampleSchema)