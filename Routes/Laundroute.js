const Router = require("express")


const  { getall, create, update, del, laundGetById}  = require("../Controllers/Laundcontroller");

const router = Router()

//sampletasks
router.get("/userget",getall);
router.post("/laundpost",create);
router.post("/laundupdate/:id",update);
router.post("/launddelete/:id",del);
router.post("/getbyid/:id",laundGetById);


module.exports = router