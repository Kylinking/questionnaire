'use strict';

var path = require('path');
var createError = require('http-errors');
var express = require('express');
var db = require('./models').db;
var redisClient = require('./models').redisClient;
var redis = require('redis');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('./log/');
var LoginRouter = require('./controllers/routes/login');
var ApiRouter = require('./controllers/routes/api/');
const util = require('./util/util');
const cors = require('cors')

var app = express();
app.db = db;
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use('/doc', express.static(__dirname + '/doc/'));
app.use('/', express.static(__dirname + '/frontend/'));
// app.get('/',(req,res)=>{
//     res.sendFile(path.resolve(__dirname+'/frontend/index.html'));
// });
// app.get('/doc',(req,res)=>{
//   res.sendFile(path.resolve(__dirname+'/doc/index.html'));
// });
//log everything in the info level 
app.all('*', function (req, res, next) {
  try {
    res.locals.logger = logger;
    res.locals.db = db;
    res.locals.redisClient = redisClient;
    res.locals.redis = redis;
    logger.info("=====================================================");
    logger.info(`Transaction begins at:${new Date().toLocaleString()}`)
    logger.info(req.ip);
    logger.info(req.method);
    logger.info(req.path);
    logger.info(req.headers);
    logger.info(req.body);
    logger.info(req.params);
    logger.info("=====================================================");
    //LogObject(logger,req);
    next();
  } catch (error) {
    logger.error(error);
    res.json({ Error: { Message: error } }).end();
  }

})
app.use('/login',
  async function (req, res, next) {
    let value = await util.RedisGetAsync(`${req.ip}`);
    if (value) {
      if (value < 5) {
        redisClient.incr(req.ip);
        redisClient.expire(req.ip, 5 * 60);
        next();
      } else {
        if (value == 5) {
          redisClient.expire(req.ip, 5 * 60);
        }
        res.json(util.MakeErrorResponse('请求太频繁，请等待5分钟后再试！')).end();
      }
    } else {
      redisClient.set(req.ip, 1);
      redisClient.expire(req.ip, 5 * 60);
      next();
    }
  },
  LoginRouter);
app.use('/api', ApiRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  throw `找不到路径:${req.path}`;
});
// error handler
app.use(function (err, req, res, next) {
  logger.error(err);
  res.json({ Error: { Message: err } }).end();
});


function LogObject(logger, obj) {
  for (let i of Object.getOwnPropertyNames(obj)) {
    logger.info(`${i}:${obj.i}`);
  }
}


module.exports = app;
