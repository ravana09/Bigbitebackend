// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// // Define schema for the entries
// const entrySchema = new Schema({
//     companyName: { type: String },
//     service: { type: String },
//     status: { type: String},
//     date: { type: Date, default: Date.now }
// });


// // Define schema for the main document
// const sampleSchema = new Schema({
//     phoneNumber: { type: String }, 
//     services: { type: [entrySchema], default: [] } // Ensure entries is an array
// },
// {
//     suppressReservedKeysWarning: true // suppress the warning
// });

// module.exports = mongoose.model("Service", sampleSchema);


const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define schema for the entries
const entrySchema = new Schema({
    companyName: { type: String },
    service: { type: String },
    status: { type: String },
    remarks: { type: String },
    date: { type: Date, default: Date.now }
});


// Define schema for the main document
const sampleSchema = new Schema({
    phoneNumber: { type: String },
    services: { type: [entrySchema], default: [] } // Ensure services is an array
}, {
    suppressReservedKeysWarning: true // suppress the warning
});

module.exports = mongoose.model("Service", sampleSchema);

