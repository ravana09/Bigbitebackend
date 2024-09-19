const Router = require("express")


const  { getall,create,update,del,getById, getloginbyemail,getloginbyphonenumber }  = require("../Controllers/Logincontroller");
const router = Router()

//sampletasks
router.get("/userget",getall);
router.post("/loginpost",create);
router.post("/loginupdate/:id",update);
router.post("/logindelete/:id",del);
router.post("/getbyid/:id",getById);
router.post("/getloginbyemailid",getloginbyemail)
router.post("/getloginbyemailid",getloginbyemail)
router.post("/getloginbyphone",getloginbyphonenumber)

module.exports = router