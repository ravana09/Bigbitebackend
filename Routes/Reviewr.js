const Router = require("express")
const {verify}= require('../middleware/verify')

const  { getall, createReview, update, del, reviewGetById}  = require("../Controllers/Review");

const router = Router()

//sampletasks
router.get("/Reviewgetall",verify,getall);
router.post("/Reviewpost",verify,createReview);
router.patch("/Reviewupdate/:id",verify,update);
router.delete("/Reviewdelete/:id",verify,del);
router.get("/Reviewgetbyid/:id",verify,reviewGetById);


module.exports = router