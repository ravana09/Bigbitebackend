
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the location schema without the _id field
const locationSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],  // Array of [longitude, latitude]
        required: true
    }
}, { _id: false }); // Disable _id for the location subdocument

// Define the main schema with companyname, phonenumber, and location
const sampleSchema = new Schema({
    companyname: { type: String, required: true },
    phonenumber: { type: String, required: true },
    location: locationSchema
});

// Create a 2dsphere index on the location field for geospatial queries
sampleSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Nearbyloc", sampleSchema);
