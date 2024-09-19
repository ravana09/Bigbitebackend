
const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const Validate = require('../middleware/validate');
const {BusinessRegister ,busLogin , busLogout, busGetAllUsers,busUpdateUser,busDeleteUser,busGetUserById , businesschangepassword, businessUpdate, create} = require('../Controllers/Businesssignup');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const validatePhoneNumber = (value) => {
   if(value.length==10){
    value = "+91"+value;
   }
   
    const phoneNumber = parsePhoneNumberFromString(value);
    if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error('Invalid phone number');
    }
    return phoneNumber;
};

router.post(
    "/businessregister", 
    check("companyName")
        .not()
        .isEmpty()
        .withMessage("Your name is required")
        .trim()
        .escape(),
        check("phoneNumber")
        .notEmpty()
        .withMessage("contact number is required")
        .custom(validatePhoneNumber),
        check("emailId")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
        check("password")
        .notEmpty()
        .withMessage("password is required")
       .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$#*!%?&])[A-Za-z\d@$#*!%?&]{8}$/)
        .withMessage("Password must be exactly 8 characters long, include at least one uppercase letter, one number, and one special character"),
         Validate,       
         BusinessRegister
);
router.post(
    "/Businesslogin",
    check("phoneNumber")
    .notEmpty()
    .withMessage("contact number is required"),
check("password").not().isEmpty(),
Validate,

    busLogin
);
router.get('/Businesslogout', busLogout);
router.get('/BusinessgetAllUsers', busGetAllUsers);
// router.put('/Businessupdate', busUpdateUser);
router.delete('/Businessdelete', busDeleteUser);
router.get('/Businessuser', busGetUserById);

router.post('/Businesschangepassword',
    check("newPassword")
        .notEmpty()
        .withMessage("Password is required")
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$#*!%?&])[A-Za-z\d@$#*!%?&]{8}$/)
        .withMessage("Password must be exactly 8 characters long, include at least one uppercase letter, one number, and one special character"),
    Validate, 
    businesschangepassword
);
router.put("/Businessupdateapi", businessUpdate);
router.post("/businesscreate", create);

module.exports=router;