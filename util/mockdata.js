var db = require('../models').db;
var util = require('./util');
(async () => {
    await util.BuildDatabase(true);
    await db.Questionnaire.create({
        Name: '乐山职业技术学院学生满意度调查表',
        CreatedBy: '督导处'
    });
    // for (let student of require('./data/Student.json')) {
    //     await db.Student.create({
    //         Name: student.Name,
    //         Id: student.Id,
    //         Gender: student.Gender,
    //         Major: student.Major,
    //         Class: student.Class,
    //         Faculty: student.Faculty
    //     });
    // };
    await db.Student.bulkCreate(require('./data/Student.json'));
    await db.Question.bulkCreate(require('./data/Question.json'));
    // for (let question of require('./data/Question.json')) {
    //     await db.Question.create({
    //         Index: question.Index,
    //         Content: question.Content,
    //         Department: question.Department,
    //         QuestionnaireId: question.QuestionnaireId
    //     });
    // }
})();
