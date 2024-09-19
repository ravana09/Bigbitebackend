const express = require('express');
const HTTP_SERVER = express();
const cors = require('cors');
const path = require('path');
require('./DbConfig')


const PORT = process.env.PORT || 5503 ;

HTTP_SERVER.use(express.json())
HTTP_SERVER.use(express.urlencoded({extended:false}))

HTTP_SERVER.use(cors())

HTTP_SERVER.listen(PORT , ()=> {
    console.log(`Listening at port ${PORT}`);
});


HTTP_SERVER.use('/',require('./App'));