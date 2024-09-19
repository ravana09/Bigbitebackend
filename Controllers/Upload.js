
const Uploadprofile = require('../Models/Uploadimage'); // Ensure this path is correct and that Uploadprofile is exported from this file
const multer = require('multer');
const path = require('path');

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be saved
    },

    
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create a new business profile with image and video
// 

module.exports.create = [
    upload.fields([{ name: 'image' }, { name: 'video', maxCount: 1 }]),
    async (req, res) => {
        try {
            // Extract file paths
            const image = req.files['image'] ? req.files['image'][0].path : '';
            const video = req.files['video'] ? req.files['video'][0].path : '';

            const newProfile = new Uploadprofile({
                image,
                video
            });

            const savedProfile = await newProfile.save();
            res.status(201).json(savedProfile);
        } catch (err) {
            if (err.code === 11000) {
                res.status(400).json({ error: "Duplicate key error: " + err.message });
            } else {
                res.status(500).json({ error: "Error creating business profile: " + err.message });
            }
        }
    }
];

// Retrieve all profiles
module.exports.getAll = async (req, res) => {
    try {
        const profiles = await Uploadprofile.find();
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ error: "Error retrieving profiles: " + err.message });
    }
};


// Update profile by ID
module.exports.updateById = [
    upload.fields([{ name: 'image' }, { name: 'video', maxCount: 1 }]),
    async (req, res) => {
        const { id } = req.params;
        try {
            // Extract file paths if available
            const image = req.files['image'] ? req.files['image'][0].path : undefined;
            const video = req.files['video'] ? req.files['video'][0].path : undefined;

            // Find and update the profile
            const updatedProfile = await Uploadprofile.findByIdAndUpdate(
                id,
                { $set: { image, video } },
                { new: true } // Return the updated document
            );

            if (!updatedProfile) {
                return res.status(404).json({ error: "Profile not found" });
            }

            res.status(200).json(updatedProfile);
        } catch (err) {
            res.status(500).json({ error: "Error updating profile: " + err.message });
        }
    }
];


// Delete profile by ID
module.exports.deleteById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProfile = await Uploadprofile.findByIdAndDelete(id);
        if (!deletedProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting profile: " + err.message });
    }
};


// Retrieve profile by ID
module.exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const profile = await Uploadprofile.findById(id);
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ error: "Error retrieving profile: " + err.message });
    }
};
