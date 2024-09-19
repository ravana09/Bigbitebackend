

const sampleModel = require('../Models/Busineessprofile')

module.exports.create = async(req,res) =>{
    const {companyName, phoneNumber, alternativeNumber,emailId,address, gstNo, website,startTime,endTime,instagram,facebook,twitter,about,yearOfEstablishment, description,leaveDays,services} = req.body;
    
    await sampleModel.create({companyName,phoneNumber,alternativeNumber,emailId,address,website, gstNo,startTime,endTime,instagram, facebook,twitter,about, yearOfEstablishment,description, leaveDays,services}).then((sample) => {
            res.status(200).json(sample);
        }).catch((err) => {
            res.status(500).json({ error: "Error saving sample"+ err });
        });
};

module.exports.BusSignup = async(req,res) =>{
  const {companyName, phoneNumber, emailId,password} = req.body;

  
  
  await sampleModel.create({companyName,phoneNumber,emailId,password}).then((sample) => {
          res.status(200).json(sample);
      }).catch((err) => {
          res.status(500).json({ error: "Error saving sample"+ err });
      });
};

module.exports.getall = async (req,res) => {
    await sampleModel.find({},{
        _id:1,
        companyName:1,
        phoneNumber:1,
        alternativeNumber:1,
        emailId:1,
        address:1,
        website:1,
        gstNo:1,
        startTime:1,
        endTime:1,
        instagram:1,
        facebook:1,
        twitter:1,
        about:1,
        yearOfEstablishment:1,
        description,
        leaveDays:1,
        services:1,


    }).then((sample) => {
        res.status(200).json(sample);

    }).catch((err) => {
        res.status(500).json({ error: "error getting sample"+ err})
    });
}

module.exports.update = async (req, res) => {
    try {
      const { id } = req.params;
      const {companyName ,phoneNumber, alternativeNumber, emailId,address,website,gstNo, startTime,endTime,instagram,facebook,twitter,about,yearOfEstablishment, description,leaveDays,services} = req.body;
  
      // Build the update object based on the fields you want to update
      const updateObject = {};
      if (companyName) updateObject.companyName = companyName; 
      if (phoneNumber) updateObject.phoneNumber = phoneNumber;
      if (alternativeNumber) updateObject.alternativeNumber = alternativeNumber;
      if (emailId) updateObject.emailId = emailId;
      if (address) updateObject.address = address;
      if (website) updateObject.website = website; 
      if (gstNo) updateObject.gstNo = gstNo;
      if (startTime) updateObject.startTime = startTime;
      if (endTime) updateObject.endTime = endTime;
      if (instagram) updateObject.instagram = instagram;
      if (facebook) updateObject.facebook = facebook;
      if (twitter) updateObject.twitter = twitter;
      if (about) updateObject.about = about;
      if (yearOfEstablishment) updateObject.yearOfEstablishment = yearOfEstablishment;
      if (description) updateObject.description = description;
      if (leaveDays) updateObject.leaveDays = leaveDays;
      if (services) updateObject.services = services;

      const updatedRecord = await sampleModel.findByIdAndUpdate( id, updateObject, { new: true });
  
      if (!updatedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }
  
      // Step 4: Send Response
      res.json( updatedRecord );
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

      module.exports.businessGetById = async (req, res) => {
        try {
          const { id } = req.params;
      
          // Find record by ID
          const record = await sampleModel.findById(id);
      
          if (!record) {
            return res.status(404).json({ error: 'Record not found' });
          }
      
          // If record found, send it in the response
          res.json(record );
      
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };