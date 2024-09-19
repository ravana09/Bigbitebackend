const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const Validate = require('../middleware/validate');
const {Register,Login , Logout, GetAllUsers,UpdateUser,DeleteUser,GetUserById , changepassword} = require('../Controllers/Usersignupc');
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
    "/register", 
    check("name")
        .not()
        .isEmpty()
        .withMessage("Your name is required")
        .trim()
        .escape(),
        check("contactNumber")
        .notEmpty()
        .withMessage("contact number is required")
        .custom(validatePhoneNumber),
        check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
        check("password")
        .notEmpty()
        .withMessage("password is required")
       .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$#*!%?&])[A-Za-z\d@$#*!%?&]{8}$/)
        .withMessage("Password must be exactly 8 characters long, include at least one uppercase letter, one number, and one special character"),
         Validate,       
       Register
);
router.post(
    "/login",
    check("contactNumber")
    .notEmpty()
    .withMessage("contact number is required"),
check("password").not().isEmpty(),
Validate,

    Login
);


router.get('/logout', Logout);
router.get('/getAllUsers', GetAllUsers);
router.put('/update', UpdateUser);
router.delete('/delete', DeleteUser);
router.get('/user', GetUserById);
router.post('/changepassword', check("newPassword")
.notEmpty()
.withMessage("password is required")
.matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$#*!%?&])[A-Za-z\d@$#*!%?&]{8}$/)
.withMessage("Password must be exactly 8 characters long, include at least one uppercase letter, one number, and one special character"),
 Validate,   changepassword )

module.exports=router;