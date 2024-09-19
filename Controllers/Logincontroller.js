const sampleModel = require('../Models/Loginmodel')

module.exports.getall = async (req,res) => {
    await sampleModel.find({},{
        _id:1,
        name:1,
        phonenumber:1,
        email:1,
        password:1,
        confirmpassword:1,
        
    }).then((sample) => {
        res.status(200).json(sample);

    }).catch((err) => {
        res.status(500).json({ error: "error getting sample"+ err})
    });
}

// module.exports.create = async(req,res) =>{
//     const {name, phonenumber, email,password,confirmpassword } = req.body;
    
//     await sampleModel.create({name, phonenumber, email,password,confirmpassword}).then((sample) => {
//             res.status(200).json(sample);
//         }).catch((err) => {
//             res.status(500).json({ error: "Error saving sample"+ err });
//         });
// };

module.exports.create = async (req, res) => {
  const { name, phonenumber, email, password, confirmpassword } = req.body;

  // Check if password and confirm password are the same
  if (password !== confirmpassword) {
      return res.status(400).json({ error: "Password and confirm password do not match." });
  }

  try {
      // Create a new user in the database
      const newUser = await sampleModel.create({ name, phonenumber, email,password, confirmpassword });

      // If user creation is successful, return the new user data
      res.status(200).json(newUser);
  } catch (err) {
      // If there is an error, return a 500 status with the error message
      res.status(500).json({ error: "Error saving user: " + err.message });
  }
};


module.exports.update = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phonenumber, email,password,confirmpassword } = req.body;
  
      // Build the update object based on the fields you want to update
      const updateObject = {};
      if (name) updateObject.name = name;
      if (phonenumber) updateObject.phonenumber = phonenumber;
      if (email) updateObject.email = email;
      if (password) updateObject.password = password;
      if (confirmpassword) updateObject.confirmpassword = confirmpassword;
    
  
      const updatedRecord = await sampleModel.findByIdAndUpdate(id, updateObject, { new: true });
  
      if (!updatedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }
  
      // Step 4: Send Response
      res.json({ message: 'Record updated successfully', data: updatedRecord });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports.del = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedRecord = await sampleModel.findByIdAndDelete(id);
  
  
      if (!deletedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }
          
          // Step 4: Send Response
          res.json({ message: 'Record deleted successfully'});
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };

      module.exports.getById = async (req, res) => {
        try {
          const { id } = req.params;
      
          // Find record by ID
          const record = await sampleModel.findById(id);
      
          if (!record) {
            
            return res.status(404).json({ error: 'Record not found' });
          }
      
          // If record found, send it in the response
          res.json({ record });
      
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };

      module.exports.getloginbyemail = async(req,res,next)=>{
        try{
          const{email,password} = req.body;
          const login = await sampleModel.find({email,password})
          if(!login || login.length===0){
            return res.status(404).json({message:"login not found"})
          }

          return res.status(200).json({login})
        }
        catch(err){
          return res.status(404).json({error:"something is wrong",message:err.message})
        }

      } 


      module.exports.getloginbyphonenumber = async (req, res, next) => {
        try {
            const { phonenumber, password } = req.body;
            
            // Find user by phone number
            const user = await sampleModel.findOne({ phonenumber });
    
            // If user does not exist or phone number is not found
            if (!user) {
                return res.status(404).json({ message: "Login not found. Please check your phone number." });
            }
    
            // Check if the provided password matches the stored password
            const isPasswordValid = user.password === password;
    
            // If password is incorrect
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password. Please try again." });
            }
    
            // If phone number and password match
            return res.status(200).json( "message: Login successful!" );
        } catch (err) {
            return res.status(500).json({ error: "Something went wrong", message: err.message });
        }
    };
    



    
