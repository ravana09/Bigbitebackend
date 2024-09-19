const sampleModel = require('../Models/Services')

module.exports.getall = async (req,res) => {
    await sampleModel.find({},{
        _id:1,
        phoneNumber:1,
        companyName:1,
        service:1,
        status:1,
        date:1,
        
    }).then((sample) => {
        res.status(200).json(sample);

    }).catch((err) => {
        res.status(500).json({ error: "error getting sample"+ err})
    });
}

module.exports.create = async(req,res) =>{
    const {phoneNumber, companyName,  service, status, date} = req.body;
    
    await sampleModel.create({phoneNumber, companyName, service, status, date}).then((sample) => {
            res.status(200).json(sample);
        }).catch((err) => {
            res.status(500).json({ error: "Error saving sample"+ err });
        });
};

module.exports.createPhone = async (req, res) => {
  const { phoneNumber, companyName, service, status, remarks, date } = req.body;

  try {
      // Function to convert any date to IST
      const convertToIST = (date) => {
          const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
          return new Date(date.getTime() + offset);
      };

      // Convert incoming date to IST if it is provided; otherwise, use the current IST date
      const dateInIST = date ? convertToIST(new Date(date)) : convertToIST(new Date());

      // Check if a document with the same phoneNumber exists
      let existingDoc = await sampleModel.findOne({ phoneNumber });

      if (existingDoc) {
          // User exists; add a new service entry to the existing document
          existingDoc.services.push({
              companyName,
              service,
              status,
              remarks,
              date: dateInIST // Ensure date is in IST
          });

          // Save the updated document with the new service entry
          const updatedDoc = await existingDoc.save();
          return res.status(200).json(updatedDoc); // Return response after updating
      } else {
          // No existing document found; create a new document
          const newSample = new sampleModel({
              phoneNumber,
              services: [{
                  companyName,
                  service,
                  status,
                  remarks,
                  date: dateInIST // Ensure date is in IST
              }]
          });

          // Save the new document
          await newSample.save();
          return res.status(201).json(newSample); // Return the newly created document
      }
  } catch (err) {
      // Handle duplicate key error specifically
      if (err.code === 11000) {
          res.status(409).json({ error: "Duplicate key error: Phone number already exists." });
      } else {
          res.status(500).json({ error: "Error saving sample: " + err.message });
      }
  }
};



module.exports.update = async (req, res) => {
    try {
      const { id } = req.params;
      const {  service, date } = req.body;
  
      // Build the update object based on the fields you want to update
      const updateObject = {};
      // if (name) updateObject.name = name; 
      // if (phoneNumber) updateObject.phoneNumber = phoneNumber;
      if (service) updateObject.service = service;
      if (date) updateObject.date = date;
      const updatedRecord = await sampleModel.findByIdAndUpdate( id, updateObject, { new: true });
  
      if (!updatedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }
  
      // Step 4: Send Response
      res.json(updatedRecord );
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

      module.exports.servicegetById = async (req, res) => {
        try {
          const { id } = req.params;
      
          // Find record by ID
          const record = await sampleModel.findById(id);
      
          if (!record) {
            
            return res.status(404).json({ error: 'Record not found' });
          }
      
          // If record found, send it in the response
          res.json( record );
      
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };