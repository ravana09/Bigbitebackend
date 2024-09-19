const mongoose = require('mongoose');
const { Schema } = mongoose;

const sampleSchema = new Schema({
    image: { type: String },
    video: { type: String }
});

module.exports = mongoose.model('Uploadprofile', sampleSchema);
