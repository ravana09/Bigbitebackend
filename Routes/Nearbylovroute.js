const express = require('express');
const router = express.Router();
const locationController = require('../Controllers/Nearbyloccontroller'); // Update with the actual path

// Routes
router.post('/locations', locationController.createLocation);
router.get('/locations/nearby', locationController.findNearbyLocations);
router.put('/locationupdate/:id', locationController.updateLocation);
router.delete('/locationdelete/:id', locationController.deleteLocation);
router.get('/getlocationbyid/:id', locationController.getLocationById)
module.exports = router;
