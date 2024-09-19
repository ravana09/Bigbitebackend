const User = require( "../Models/Usersignupm");
const bcrypt=require('bcrypt');
const { gfs } = require('../DbConfig');


const Register= async (req, res)=> {
       
    const {name,contactNumber, email, password } = req.body;
    
   
    try {
      const newUser = new User({
             name,
            contactNumber,
            email,
            password,
           
        });

        const existingUser = await User.findOne({ contactNumber });
        const existinguserbyemail = await User.findOne({email});   
             
        if (existingUser && existinguserbyemail){
          
            return res.status(400).json({
                status: "failed",
                message: "You already have an account, please login",
            });}
            
             else if (existingUser){
          
            return res.status(400).json({
                status: "failed",
                message: "You already have an account with this phone number, please login",
            });}
        
          
          else if (existinguserbyemail){
          
            return res.status(400).json({
                status: "failed",
                message: "You already have an account with this email, please login",
            });}
        
         const savedUser = await newUser.save(); 
     
     
        console.log("after save");
        console.log("a");
       const { role, ...user_data } = savedUser._doc;
        res.status(200).json(user_data
            
        );
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: err,
        });
    }
    res.end();
}

const GetAllUsers = async (req, res) => {
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

 const Login = async  (req, res) =>{
    const { contactNumber } = req.body;
    try {
  
        const user = await User.findOne({ contactNumber }).select("+password");
        if (!user)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid Mobile Number or password. Please try again with the correct credentials.",
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
                    "Invalid Mobile Number or password. Please try again with the correct credentials.",
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
        res.cookie("account_type", user.account_type);
        res.cookie("account_token" ,process.env.USER_ACCOUNT_TOKEN )
        res.status(200).json({
            account_type : user.account_type,
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


const Logout= async (req, res)=> {
    try {
        console.log('entered');
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


  const UpdateUser = async (req, res) => {
    const id  = req.query.id; 
    const { name, contactNumber, email, password } = req.body; // Data to update

    try {
        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
                
            });
        }
        
    


        // Update the user details
        if (name) user.name = name;
        if (contactNumber) user.contactNumber = contactNumber;
        if (email) user.email = email;
        if (password) {
            // Hash the new password before saving
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

    

        // Save the updated user
     const updateduser=   await user.save();

        res.status(200).json(
            updateduser);
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};

const DeleteUser = async (req, res) => {
    console.log("jhdjh");
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

const GetUserById = async (req, res) => {
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


const changepassword= async(req , res)=>{
    try{
const {contactNumber , newPassword}=req.body;
// const updatedUser = await User.findOneAndUpdate(
//     { contact_number: contact_number },  // Query to find the document
//     { $set: { password: newpassword } }, // Update operation
//     { new: true, useFindAndModify: false } // Options: return the updated document, disable useFindAndModify
//   );
//   if(!updatedUser){
//      return res.status(404).json({
//         message:"No account present with that contact number"
//     })
//   }
const user = await User.findOne({ contactNumber });
if(!user){
    return res.status(404).json({
           message:"No account present with that contact number"
          })
}
else
      user.password=newPassword;
    
       await user.save();
       console.log("saved");
   return res.status(200).json({message:"password changed successfully"})
   


}
catch(err){
    res.status(500).json({
        err
    })
}

}



module.exports = { Register, Login, Logout, GetAllUsers, UpdateUser, DeleteUser, GetUserById , changepassword };


