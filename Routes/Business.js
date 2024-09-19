const express = require('express');
const router = express.Router();
const {create , getall, update,del,businessGetById, BusSignup} = require('../Controllers/Businessc');
const { getById } = require('../Controllers/Logincontroller');


// Create a new business profile
router.post('/Businesspost', create);
router.get('/Businessgetall', getall);
router.post("/Businessupdate/:id",update);
router.post("/Businessdelete/:id",del);
router.post("/Businessgetbyid/:id",businessGetById);
router.post("//businessregister:id",BusSignup);

module.exports = router;

