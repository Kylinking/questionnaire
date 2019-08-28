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
    if (instance.Status != 1 ){
      res.json(util.MakeErrorResponse('该生信息已注销')).end();
      return;
    }else if (instance.Submit != 0 ){
      res.json(util.MakeErrorResponse('您的调查问卷已经完成过了，感谢您的参与！')).end();
      return;
    }
    let admin = 0;
    if (instance.Name == '管理员'){
      admin = 1;
    }
    const token = jwt.encode({
        id:instance.Id,
        classId:instance.ClassId,
        name:instance.Name,
        admin
    }, jwtSecret);
    res.json({Data:{
      Admin:admin,
      Token:token,
      Id,Name,
      ClassId:instance.ClassId,
    }}).end();
    return;
  }else{
    res.json(util.MakeErrorResponse('学号与姓名不匹配')).end();
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

