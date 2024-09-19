const Nearbyloc = require('../Models/Nearbylocmodel'); // Update with the actual path to your model

// Controller method to create a new location
exports.createLocation = async (req, res) => {
    try {
        const { companyname, phonenumber, location } = req.body;

        // Validate required fields
        if (!companyname || !phonenumber || !location || !location.type || !location.coordinates || location.coordinates.length !== 2) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        // Validate location type
        if (location.type !== 'Point') {
            return res.status(400).json({ message: 'Location type must be Point' });
        }

        // Create a new location document
        const newLocation = new Nearbyloc({
            companyname,
            phonenumber,
            location: {
                type: location.type,
                coordinates: [location.coordinates[0], location.coordinates[1]]  // [longitude, latitude]
            }
        });

        // Save the document to the database
        await newLocation.save();

        // Respond with the created document
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



// Find nearby locations


exports.findNearbyLocations = async (req, res) => {
    try {
        const { longitude, latitude, maxDistance } = req.body;

        // Validate the input presence
        if (!longitude || !latitude || !maxDistance) {
            return res.status(400).json({ message: 'All input fields (longitude, latitude, maxDistance) are required' });
        }

        // Convert inputs to appropriate types
        const lon = parseFloat(longitude);
        const lat = parseFloat(latitude);
        const distance = parseInt(maxDistance, 10); // Convert maxDistance to an integer

        // Validate coordinates and distance
        if (isNaN(lon) || isNaN(lat) || isNaN(distance)) {
            return res.status(400).json({ message: 'Invalid input values. Ensure longitude, latitude are numbers and maxDistance is a valid integer.' });
        }

        // Perform the query to find nearby locations
        const locations = await Nearbyloc.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lon, lat] // [longitude, latitude]
                    },
                    $maxDistance: distance // distance in meters
                }
            }
        });

        // Return success response with the found locations
        res.status(200).json( locations );
    } catch (error) {
        // Handle any unexpected errors
        console.error('Server error:', error); // Log error details for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Update a location by ID
exports.updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { companyname, phonenumber, coordinates } = req.body;

        const updatedLocation = await Nearbyloc.findByIdAndUpdate(
            id,
            {
                companyname,
                phonenumber,
                location: {
                    type: 'Point',
                    coordinates
                }
            },
            { new: true }
        );

        if (!updatedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.status(200).json( updatedLocation );
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a location by ID
exports.deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLocation = await Nearbyloc.findByIdAndDelete(id);

        if (!deletedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.status(200).json({ message: 'Location deleted successfully', data: deletedLocation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getLocationById = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters

        // Find the location by ID
        const location = await Nearbyloc.findById(id);

        // Check if the location exists
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        // Respond with the found location
        res.status(200).json(location);
    } catch (error) {
        console.error('Server error:', error); // Log error details for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

