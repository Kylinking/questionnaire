const express = require('express');
const router = express.Router();
const util = require('../../../../util/util');


router.get('/statistics', async (req, res) => {
    let {
        db,
        logger,
        admin
    } = {
        ...res.locals
    };
    let gradeName = req.query.grade || null;
    let sequelize = db.sequelize;
    let grade = null;
    try {
        if (!admin) {
            res.json(util.MakeErrorResponse(`此用户无权限！`)).end();
            return;
        }
        if (!gradeName) {
            grade = await db.Grade.findOne({
                where: {
                    Name: gradeName
                }
            });
            if (!grade) {
                res.json(util.MakeErrorResponse(`此年级不存在！`)).end();
                return;
            }
        }
        let TotalCount = (await db.CountStatistics.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('Total')), 'Total'],
                [sequelize.fn('SUM', sequelize.col('Submit')), 'Submit'],
            ],
            where: {
                GradeId: grade.Id
            }
        })).toJSON();
        let TotalAnswers = (await db.AnswerStatistics.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('ExtremelySatisfied')), 'ExtremelySatisfied'],
                [sequelize.fn('SUM', sequelize.col('Satisfied')), 'Satisfied'],
                [sequelize.fn('SUM', sequelize.col('Unsatisfied')), 'Unsatisfied'],
                [sequelize.fn('SUM', sequelize.col('ExtremelyUnsatisfied')), 'ExtremelyUnsatisfied'],
                'QuestionId'
            ],
            include: [db.Question, {
                model: db.ClassInfo,
                where: {
                    GradeId: grade.Id
                }
            }],
            group: ['QuestionId']
        }));
        let FacultyCount = (await db.CountStatistics.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('Total')), 'Total'],
                [sequelize.fn('SUM', sequelize.col('Submit')), 'Submit'],
                'FacultyId'
            ],
            group: ['FacultyId'],
            include: [db.Faculty],
            where: {
                GradeId: grade.Id
            }
        })) //.toJSON();
        let FacultyAnswers = (await db.AnswerStatistics.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('ExtremelySatisfied')), 'ExtremelySatisfied'],
                [sequelize.fn('SUM', sequelize.col('Satisfied')), 'Satisfied'],
                [sequelize.fn('SUM', sequelize.col('Unsatisfied')), 'Unsatisfied'],
                [sequelize.fn('SUM', sequelize.col('ExtremelyUnsatisfied')), 'ExtremelyUnsatisfied'],
                'FacultyId', 'QuestionId'
            ],
            group: ['FacultyId', 'QuestionId'],
            include: [db.Faculty, db.Question, {
                model: db.ClassInfo,
                where: {
                    GradeId: grade.Id
                }
            }]
        }));
        res.json({
            Data: {
                TotalAnswers,
                TotalCount,
                FacultyAnswers,
                FacultyCount
            }
        }).end();
    } catch (error) {
        logger.error(error);
    }
})

router.get('/statistics/:facultyId', async (req, res) => {
    let {
        db,
        logger,
        admin
    } = {
        ...res.locals
    };
    let gradeName = req.query.grade || null;
    let grade = null;
    let facultyId = req.params.facultyId;
    let sequelize = db.sequelize;
    try {
        if (!admin) {
            res.json(util.MakeErrorResponse(`此用户无权限！`)).end();
            return;
        }
        if (!gradeName) {
            grade = await db.Grade.findOne({
                where: {
                    Name: gradeName
                }
            });
            if (!grade) {
                res.json(util.MakeErrorResponse(`此年级不存在！`)).end();
                return;
            }
        }
        let TotalCount = (await db.CountStatistics.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('Total')), 'Total'],
                [sequelize.fn('SUM', sequelize.col('Submit')), 'Submit'],
            ],
            where: {
                FacultyId: facultyId,
                GradeId: grade.Id
            }
        })).toJSON();
        let TotalAnswers = (await db.AnswerStatistics.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('ExtremelySatisfied')), 'ExtremelySatisfied'],
                [sequelize.fn('SUM', sequelize.col('Satisfied')), 'Satisfied'],
                [sequelize.fn('SUM', sequelize.col('Unsatisfied')), 'Unsatisfied'],
                [sequelize.fn('SUM', sequelize.col('ExtremelyUnsatisfied')), 'ExtremelyUnsatisfied'],
                'QuestionId'
            ],
            where: {
                FacultyId: facultyId
            },
            include: [db.Question, {
                model: db.ClassInfo,
                where: {
                    GradeId: grade.Id
                }
            }],
            group: ['QuestionId']
        }));
        let ClassAnswers = (await db.AnswerStatistics.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('ExtremelySatisfied')), 'ExtremelySatisfied'],
                [sequelize.fn('SUM', sequelize.col('Satisfied')), 'Satisfied'],
                [sequelize.fn('SUM', sequelize.col('Unsatisfied')), 'Unsatisfied'],
                [sequelize.fn('SUM', sequelize.col('ExtremelyUnsatisfied')), 'ExtremelyUnsatisfied'],
                'ClassId', 'QuestionId'
            ],
            where: {
                FacultyId: facultyId
            },
            include: [db.Question, {
                model: db.ClassInfo,
                where: {
                    GradeId: grade.Id
                }
            }],
            group: ['ClassId', 'QuestionId', ]
        }));
        let ClassCount = (await db.ClassInfo.findAll({
            attributes: [
                'Total', 'Submit', 'Id', 'Name'
            ],
            where: {
                FacultyId: facultyId,
                GradeId: grade.Id
            },
        }))
        res.json({
            Data: {
                TotalAnswers,
                TotalCount,
                ClassAnswers,
                ClassCount
            }
        }).end();
    } catch (error) {
        logger.error(error);
    }
})








module.exports = router;