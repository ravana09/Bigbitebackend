
const User=require("../Models/Businesssignupm")
const bcrypt=require('bcrypt');
const { gfs } = require('../DbConfig');


// const BusinessRegister= async (req, res)=> {
       
//     const {companyName,phoneNumber, emailId, password } = req.body;
    
   
//     try {
//       const newUser = new User({
//             companyName,
//             phoneNumber,
//             emailId,
//             password,
           
//         });

        
//         const existingUser = await User.findOne({ phoneNumber });
//         const existinguserbyemail = await User.findOne({emailId});   
             
//         if (existingUser && existinguserbyemail){
          
//             return res.status(400).json({
//                 status: "failed",
//                 message: "You already have an account, please login",
//             });}
            
//              else if (existingUser){
          
//             return res.status(400).json({
//                 status: "failed",
//                 message: "You already have an account with this phone number, please login",
//             });}
        
           
//           else if (existinguserbyemail){
          
//             return res.status(400).json({
//                 status: "failed",
//                 message: "You already have an account with this email, please login",
//             });}
        
//          const savedUser = await newUser.save(); 
     
     
//         console.log("after save");
//         console.log("a");
//        const { role, ...user_data } = savedUser._doc;
//         res.status(200).json(user_data
            
//         );
//     } catch (err) {
//         res.status(500).json({
//             status: "error",
//             code: 500,
//             data: [],
//             message: err,
//         });
//     }
//     res.end();
// }

const BusinessRegister = async (req, res) => {
    const { companyName, phoneNumber, emailId, password } = req.body;

    try {
        const existingUser = await User.findOne({ phoneNumber });
        const existingUserByEmail = await User.findOne({ emailId });

        if (existingUser && existingUserByEmail) {
            return res.status(400).json({
                status: "failed",
                message: "You already have an account, please login",
            });
        } else if (existingUser) {
            return res.status(400).json({
                status: "failed",
                message: "You already have an account with this phone number, please login",
            });
        } else if (existingUserByEmail) {
            return res.status(400).json({
                status: "failed",
                message: "You already have an account with this email, please login",
            });
        }

        const newUser = new User({
            companyName,
            phoneNumber,
            emailId,
            password,
        });

        const savedUser = await newUser.save();

        // Format the response to exclude 'services' field if it's empty
        const user_data = savedUser.toObject();
        if (!user_data.services.length) {
            delete user_data.services;
        }

        res.status(200).json(user_data);
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: err.message,
        });
    }
};



const busGetAllUsers = async (req, res) => {
    try {
        // Find all users
        const users = await User.find();

        // Check if users exist
        if (!users.length) {
            return res.status(404).json({
                status: "failed",
                message: "No users found",
            });
        }

        // Respond with all users
        res.status(200).json(
             users
        );
        
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};

 const busLogin = async  (req, res) =>{
    const { phoneNumber } = req.body;
    try {
  
        const user = await User.findOne({ phoneNumber }).select("+password");
        if (!user)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
      
        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        );
    
        if (!isPasswordValid)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        
        const { password, ...user_data } = user._doc;
        let options = {
            maxAge: 20 * 60 * 1000, // would expire in 20minutes
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };
      
        const token = user.generateAccessJWT(); 
    
        res.cookie("SessionID", token, options); 
        res.cookie("accountType", user.accountType);
        res.cookie("account_token" ,process.env.USER_ACCOUNT_TOKEN )
        res.status(200).json({
            accountType : user.accountType,
            account_token : process.env.USER_ACCOUNT_TOKEN,
            userid:user._id,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.end();
}


const busLogout= async (req, res)=> {
    try {
        
      const authHeader = req.headers['cookie']; 
      if (!authHeader) return res.sendStatus(204);
      const cookie = authHeader.split('=')[1]; 
      const accessToken = cookie.split(';')[0];
    //  const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); 
    
    //  if (checkIfBlacklisted) return res.sendStatus(204);
     
    //   const newBlacklist = new Blacklist({
    //     token: accessToken,
    //   });
      
    //   await newBlacklist.save();
    //   res.setHeader('Clear-Site-Data', '"cookies"');
      res.clearCookie("SessionID");
      res.clearCookie("account_token");
      res.clearCookie("account_type");
      res.status(200).json({ message: 'You are logged out!' });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
    res.end();
  }


//   const busUpdateUser = async (req, res) => {
//     const id  = req.query.id; 
//     const { companyName, phoneNumber, emailId, password } = req.body; // Data to update

//     try {
//         // Find the user by ID
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({
//                 status: "failed",
//                 message: "User not found",
                
//             });
//         }
//         // Update the user details
//         if (companyName) user.companyName = companyName;
//         if (phoneNumber) user.phoneNumber = phoneNumber;
//         if (emailId) user.emailId = emailId;
//         if (password) {
//             // Hash the new password before saving
//             const salt = await bcrypt.genSalt(10);
//             user.password = await bcrypt.hash(password, salt);
//         }

    

//         // Save the updated user
//      const updateduser=   await user.save();

//         res.status(200).json(
//             updateduser);
//     } catch (err) {
//         res.status(500).json({
//             status: "error",
//             message: "Internal Server Error",
//         });
//     }
// };

const busDeleteUser = async (req, res) => {
    
    const  id  = req.query.id;
    

    try {
        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "User deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};

const busGetUserById = async (req, res) => {
    const id  = req.query.id;

    try {
        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }

        res.status(200).json(
             user
        );
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};

const businesschangepassword = async (req, res) => {
    try {
        const { phoneNumber, newPassword } = req.body;

        // Find the user by phone number
        const user = await User.findOne({ phoneNumber });
 
        if (!user) {
            return res.status(404).json({
                message: "No account present with that contact number"
            });
        }

        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        // Send more detailed error messages
        return res.status(500).json({
            error: err.message || "Something went wrong"
        });
    }
};


// 

// const businessUpdate = async (req, res) => {
//     const id = req.query.id; // Extract the id from query parameters
//     const { companyName, phoneNumber, emailId, alternativeNumber, address, website, gstNo, startTime, endTime, instagram, facebook, twitter,whatsapp,youtube, yearOfEstablishment, about, description, services } = req.body; // Data to update


    
//     try {
//         // Find the user by ID
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found",
//             });
//         }

//         console.log("User before update: ", user);

//         // Update the user details
//         if (companyName) user.companyName = companyName;
//         if (phoneNumber) user.phoneNumber = phoneNumber;
//         if (alternativeNumber) user.alternativeNumber = alternativeNumber;
//         if (emailId) user.emailId = emailId;
//         if (address) user.address = address;
//         if (website) user.website = website;
//         if (gstNo) user.gstNo = gstNo;
//         if (startTime) user.startTime = startTime;
//         if (endTime) user.endTime = endTime;
//         if (instagram) user.instagram = instagram;
//         if (facebook) user.facebook = facebook;
//         if (twitter) user.twitter = twitter;
//         if (whatsapp) user.whatsapp = whatsapp;
//         if (youtube) user.youtube = youtube;
//         if (yearOfEstablishment) user.yearOfEstablishment = yearOfEstablishment;
//         if (about) user.about = about;
//         if (description) user.description = description;
//         if (services) user.services = services;

//         // Save the updated user
//         const updatedUser = await user.save();
//         console.log("User after update: ", updatedUser);
        
//         res.status(200).json(updatedUser);
//     } catch (err) {
//         console.error("Error during user update:", err);  // Log the actual error
//         res.status(500).json({
//             message: "Internal Server Error",
//             error: err.message // Send the specific error message
//         });
//     }
// };


const businessUpdate = async (req, res) => {
    const id = req.query.id; // Extract the id from query parameters
    const { 
        companyName, 
        phoneNumber, 
        emailId, 
        alternativeNumber, 
        address, 
        website, 
        gstNo, 
        startTime, 
        endTime, 
        instagram, 
        facebook, 
        twitter,
        whatsapp,
        youtube, 
        yearOfEstablishment, 
        about, 
        description, 
        services // String or array of services 
    } = req.body; // Data to update

    try {
        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        console.log("User before update: ", user);

        // Update the user details
        if (companyName) user.companyName = companyName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (alternativeNumber) user.alternativeNumber = alternativeNumber;
        if (emailId) user.emailId = emailId;
        if (address) user.address = address;
        if (website) user.website = website;
        if (gstNo) user.gstNo = gstNo;
        if (startTime) user.startTime = startTime;
        if (endTime) user.endTime = endTime;
        if (instagram) user.instagram = instagram;
        if (facebook) user.facebook = facebook;
        if (twitter) user.twitter = twitter;
        if (whatsapp) user.whatsapp = whatsapp;
        if (youtube) user.youtube = youtube;
        if (yearOfEstablishment) user.yearOfEstablishment = yearOfEstablishment;
        if (about) user.about = about;
        if (description) user.description = description;

        // Handle `services` field
        if (services) {
            if (typeof services === 'string') {
                // Convert the comma-separated string to an array of objects
                const servicesArray = services.split(',').map(service => ({ serviceName: service.trim() }));
                user.services = servicesArray;
            } else if (Array.isArray(services)) {
                // If services are already in an array format, use them directly
                user.services = services;
            }
        }

        // Save the updated user
        const updatedUser = await user.save();
        console.log("User after update: ", updatedUser);
        
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error during user update:", err);  // Log the actual error
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message // Send the specific error message
        });
    }
};


const create = async(req,res) =>{
    const { companyName, phoneNumber,password, emailId,alternativeNumber, address,website, gstNo,startTime,endTime,instagram,facebook,twitter,whatsapp,youtube, yearOfEstablishment,about,description,services  } = req.body;
    let formattedServices = [];
    if (services) {
        if (typeof services === 'string') {
            // Convert comma-separated string to array of objects
            const servicesArray = services.split(',').map(service => ({ serviceName: service.trim() }));
            formattedServices = servicesArray;
        } else if (Array.isArray(services)) {
            // If it's already an array, use it directly
            formattedServices = services;
        }
    }
    await User.create({companyName, phoneNumber,password, emailId,alternativeNumber, address,website, gstNo,startTime,endTime,instagram,facebook,twitter,whatsapp,youtube, yearOfEstablishment,about,description,services: formattedServices}).then((sample) => {
            res.status(200).json(sample);
        }).catch((err) => {
            res.status(500).json({ error: "Error saving sample"+ err });
        });
};

module.exports = { BusinessRegister, busLogin, busLogout, busGetAllUsers, busDeleteUser, busGetUserById , businesschangepassword,businessUpdate, create};


