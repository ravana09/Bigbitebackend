const Router = require("express")


const  { getall, create, createPhone,update, del, servicegetById}  = require("../Controllers/Service");
// const { getById } = require("../Controllers/Upload");

const router = Router()

//sampletasks
router.get("/servicegetall",getall);
router.post("/servicepostphone",createPhone);
router.post("/servicepost",create);
router.post("/serviceupdate/:id",update);
router.post("/servicedelete/:id",del);
router.post("/servicegetbyid/:id",servicegetById);


module.exports = router