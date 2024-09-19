const User = require("../Models/Usersignupm.js");
const jwt = require("jsonwebtoken");
const verify = async(req, res, next)=> {
    console.log('hiii');
    try {
        
const accessToken = req.cookies.SessionID

        console.log(accessToken);
        console.log('heloooo');
        if(!accessToken){
            
            return res
                    .status(401)
                     .json({ message: "Please login before making requests" });
             
        }
        else 
        jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
                  if (err) {
                     
                         return res
                       .status(401)
                        .json({ message: "Please login before making requests" });
                }
            
            //     
    //     const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); 
    
    // if (checkIfBlacklisted)
    //     return res
    //         .status(401)
    //         .json({ message: "This session has expired. Please login" });
    //     jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
    //         if (err) {
             
    //             return res
    //                 .status(401)
    //                 .json({ message: "This session has expired. Please login" });
    //         }
    //      console.log(decoded);
          try{  const { id } = decoded; 
            const user = await User.findById(id); 
            const { password, ...data } = user._doc;
            req.user = data; 
            next();}
            catch(err){
                console.log(err);
            }
        
        
        
        
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}





module.exports={verify
}