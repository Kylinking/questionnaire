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
        db.sequelize.transaction(async transaction => {
            await db.Answer.bulkCreate(Answers, { transaction });
            let student = await db.Student.findByPk(studentId, { transaction });
            if (student.Submit != 0) {
                throw '该生已提交过调查问卷，请勿重复提交！'
            }
            student.Submit = 1;
            await student.save({ transaction });
            let classInfo = await student.getClassInfo({transaction});
            classInfo.increment('Submit');
            await classInfo.save({transaction});
            let countStat = await db.CountStatistics.findOne({
                where:{
                    FacultyId:classInfo.FacultyId,
                    GradeId:classInfo.GradeId
                }
            });
            countStat.increment('Submit');
            await countStat.save({transaction});
            let answerStats = await db.AnswerStatistics.findAll({
                where:{
                    ClassId:classInfo.Id
                }
            });
            for (let astat of answerStats){
                for (let ans of Answers){
                    if (astat.QuestionId == ans.QuestionId){
                        astat.increment([mapSelect2Field(ans.Select)]);
                        astat.save({transaction});
                        break;
                    }
                }
            }
        });
        res.json(util.MakeResponse({ Message: '感谢参与本次调查问卷！' })).end();
    } catch (error) {
        logger.error(error);
        res.json(util.MakeErrorResponse('error')).end();
    }
});

function mapSelect2Field(select)
{
    return ['ExtremelySatisfied','Satisfied','Unsatisfied','ExtremelyUnsatisfied'][['非常满意','满意','基本满意','不满意'].indexOf(select)];
}


router.use((req, res, next) => {
    next();
})

module.exports = router;