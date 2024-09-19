const sampleModel = require('../Models/Laundmodel')

module.exports.getall = async (req,res) => {
    await sampleModel.find({},{
        _id:1,
        name:1,
        clientid:1,
        phonenumber:1,
        email:1,
        address:1,
    }).then((sample) => {
        res.status(200).json(sample);

    }).catch((err) => {
        res.status(500).json({ error: "error getting sample"+ err})
    });
}

module.exports.create = async(req,res) =>{
    const {name,clientid ,phonenumber,email,address} = req.body;
    
    await sampleModel.create({name,clientid, phonenumber,email,address}).then((sample) => {
            res.status(200).json(sample);
        }).catch((err) => {
            res.status(500).json({ error: "Error saving sample"+ err });
        });
};

module.exports.update = async (req, res) => {
    try {
      const { id } = req.params;
      const { name,clientid, phonenumber, email,address } = req.body;
  
      // Build the update object based on the fields you want to update
      const updateObject = {};
      if (name) updateObject.name = name; 
      if (clientid) updateObject.clientid = clientid;
      if (phonenumber) updateObject.phonenumber = phonenumber;
      if (email) updateObject.email = email;
      if (address) updateObject.address = address;
      const updatedRecord = await sampleModel.findByIdAndUpdate( id, updateObject, { new: true });
  
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

 

  module.exports.laundGetById = async (req, res) => {
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
  
  