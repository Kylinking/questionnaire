'use strict';

const express = require('express');
const router = express.Router();
const util = require('../../../../util/util');
router.get('/questions', async (req, res) => {
    let { db, logger } = { ...res.locals };
    try {
        let Questions = await db.Question.findAll();
        res.status(200).json({
            Data: {
                Questions
            }
        }).end();
    } catch (error) {
        logger.error(error);
    }
})

router.post('/answers', async (req, res) => {
    let { db, logger, studentId } = { ...res.locals };
    let { Answers } = { ...req.body };
    let transaction;
    try {
        if (!Answers || !Array.isArray(Answers)) {
            throw '请求参数错误';
        }
        db.sequelize.transaction(async tranc => {
            await db.Answer.bulkCreate(Answers, { tranc });
            let student = await db.Student.findByPk(studentId, { tranc });
            if (student.Submit != 0) {
                throw '该生已提交过调查问卷，请勿重复提交！'
            }
            student.Submit = 1;
            await student.save({ tranc });
        });
        res.json(util.MakeResponse({ Message: '感谢参与本次调查问卷！' })).end();
    } catch (error) {
        logger.error(error);
        res.json(util.MakeErrorResponse('error')).end();
    }
});

router.use((req, res, next) => {
    next();
})

module.exports = router;