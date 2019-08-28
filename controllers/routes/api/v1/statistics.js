const express = require('express');
const router = express.Router();
const util = require('../../../../util/util');


router.get('/statistics', async (req, res) => {
    let { db, logger, role } = { ...res.locals };
    let sequelize = db.sequelize;
    try {
        if (!role){
            //res.json(util.MakeErrorResponse(`此用户无权限！`)).end();
            //return;
        }
        let TotalCount = (await db.CountStatistics.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('Total')), 'Total'],
                [sequelize.fn('SUM', sequelize.col('Submit')), 'Submit'],
            ]
        })).toJSON();
        let TotalAnswers = (await db.AnswerStatistics.findAll({
            attributes:[
                [sequelize.fn('SUM', sequelize.col('ExtremelySatisfied')), 'ExtremelySatisfied'],
                [sequelize.fn('SUM', sequelize.col('Satisfied')), 'Satisfied'],
                [sequelize.fn('SUM', sequelize.col('Unsatisfied')), 'Unsatisfied'],
                [sequelize.fn('SUM', sequelize.col('ExtremelyUnsatisfied')), 'ExtremelyUnsatisfied'],
                'QuestionId'
            ],
            include:[db.Question],
            group:['QuestionId']
        }));
        let FacultyCount = (await db.CountStatistics.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('Total')), 'Total'],
                [sequelize.fn('SUM', sequelize.col('Submit')), 'Submit'],
                'FacultyId'
            ],
            group:['FacultyId'],
            include:[db.Faculty]
        }))//.toJSON();
        let FacultyAnswers = (await db.AnswerStatistics.findAll({
            attributes:[
                [sequelize.fn('SUM', sequelize.col('ExtremelySatisfied')), 'ExtremelySatisfied'],
                [sequelize.fn('SUM', sequelize.col('Satisfied')), 'Satisfied'],
                [sequelize.fn('SUM', sequelize.col('Unsatisfied')), 'Unsatisfied'],
                [sequelize.fn('SUM', sequelize.col('ExtremelyUnsatisfied')), 'ExtremelyUnsatisfied'],
                'FacultyId','QuestionId'
            ],
            group:['FacultyId','QuestionId'],
            include:[db.Faculty,db.Question]
        }));
        res.json({Data:{
            TotalAnswers,TotalCount,FacultyAnswers,FacultyCount
        }}).end();
    } catch (error) {
        logger.error(error);
    }
})

router.get('/statistics/:facultyId', async (req, res) => {
    let { db, logger ,role} = { ...res.locals };
    let facultyId = req.params.facultyId;
    let sequelize = db.sequelize;
    try {
        if (!role){
            //res.json(util.MakeErrorResponse(`此用户无权限！`)).end();
            //return;
        }
        let TotalCount = (await db.CountStatistics.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('Total')), 'Total'],
                [sequelize.fn('SUM', sequelize.col('Submit')), 'Submit'],
            ],
            where:{
                FacultyId:facultyId
            }
        })).toJSON();
        let TotalAnswers = (await db.AnswerStatistics.findAll({
            attributes:[
                [sequelize.fn('SUM', sequelize.col('ExtremelySatisfied')), 'ExtremelySatisfied'],
                [sequelize.fn('SUM', sequelize.col('Satisfied')), 'Satisfied'],
                [sequelize.fn('SUM', sequelize.col('Unsatisfied')), 'Unsatisfied'],
                [sequelize.fn('SUM', sequelize.col('ExtremelyUnsatisfied')), 'ExtremelyUnsatisfied'],
                'QuestionId'                
            ],
            where:{
                FacultyId:facultyId
            },
            include:[db.Question],
            group:['QuestionId']
        }));
        let ClassAnswers = (await db.AnswerStatistics.findAll({
            attributes:[
                [sequelize.fn('SUM', sequelize.col('ExtremelySatisfied')), 'ExtremelySatisfied'],
                [sequelize.fn('SUM', sequelize.col('Satisfied')), 'Satisfied'],
                [sequelize.fn('SUM', sequelize.col('Unsatisfied')), 'Unsatisfied'],
                [sequelize.fn('SUM', sequelize.col('ExtremelyUnsatisfied')), 'ExtremelyUnsatisfied'],
                'ClassId','QuestionId'
            ],
            where:{
                FacultyId:facultyId
            },
            include:[db.ClassInfo,db.Question],
            group:['ClassId','QuestionId',]
        }));
        let ClassCount = (await db.ClassInfo.findAll({
            attributes: [
                'Total','Submit','Id','Name'
            ],
            where:{
                FacultyId:facultyId
            },
        }))
        res.json({Data:{
            TotalAnswers,TotalCount,ClassAnswers,ClassCount
        }}).end();
    } catch (error) {
        logger.error(error);
    }
})








module.exports = router;