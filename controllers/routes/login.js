'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const jwtSecret = require('../../config/global.json').jwtSecret;
let util = require('../../util/util');
//TODO: Take expire time
const expireTime = 8 * 3600; //seconds

// Login in
router.post('/', async function (req, res, next) {
  let { logger, db } = { ...res.locals };
  let { Name, Id } = { ...req.body };
  let instance = await db.Student.findOne({
    where: {
      Name, Id
    }
  });
  if (instance){
    const token = jwt.encode({
        id:instance.Id,
        classId:instance.ClassId,
        name:instance.Name,
    }, jwtSecret);
    res.json({Data:{
      Token:token,
      Id,Name,
      ClassId:instance.ClassId
    }}).end();
    return;
  }else{
    res.json({Error:{Message:'学号与姓名不匹配'}}).end();
  }  
});




router.use('/', (req, res) => {
  res.json({
    Error: {
      Message: "No Service with " + req.method
    }
  }).end();
})

module.exports = router;

