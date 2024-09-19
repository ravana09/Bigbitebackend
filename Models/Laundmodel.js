const mongoose = require("mongoose")
const { Schema} = mongoose

const sampleSchema = new Schema ({
    name : {type:String}, 
    clientid : {type:String},
    phonenumber :{type:Number},
    email:{type:String},
    address:{type:String},

},
{
    suppressReservedKeysWarning:true // suppress the warnig
}
);
module.exports = mongoose.model("Laundcol",sampleSchema)