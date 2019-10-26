var db = require('../models').db;
var util = require('./util');
let faculties = ['体育系', '医学系', '护理系', '新能源工程系', '旅游系', '机电工程系', '电子信息工程系', '药学系', '财经管理系'];
let majors = ['护理', '临床医学', '光伏材料制备技术', '工程造价', '药学', '物联网应用技术', '移动通信技术', '中医学', '硅材料制备技术', '康复治疗技术', '电子商务', '光伏发电技术与应用', '医学检验技术', '工业分析技术', '助产', '药物制剂技术', '中药学', '药品经营与管理', '食品检测技术', '老年保健与管理', '机械设计与制造', '数控技术', '汽车检测与维修技术', '机电设备维修与管理', '智能交通技术运用', '工业机器人技术', '工商企业管理', '会计', '物流管理', '影视动画', '农产品加工与质量检测', '财务管理', '旅游管理', '酒店管理', '广告设计与制作', '导游', '环境艺术设计', '空中乘务', '烹调工艺与营养', '休闲体育', '应用电子技术', '移动应用开发', ];
let classes = ['国际护理18-1', '普专临床医学18-3', '普专光伏18-2(晶科班)', '普专造价18-2', '普专康复护理18-1', '普专药学18-3', '普专对口药学18-4', '普专物联网18-2', '普专通信18-1', '普专中医18-2', '普专硅材料18-1', '普专护理18-1', '普专护理18-3', '普专光伏(现代学徒制)18-4', '普专光伏18-3(正泰班)', '普专光伏18-1', '普专护理18-2', '普专康复技术18-1', '普专商务18-3', '普专光电18-1', '普专医检18-1', '普专光电18-2', '普专光电18-3', '普专工检18-1', '涉外护理18-2', '普专商务18-2', '普专助产18-2', '普专康复技术18-3', '普专药学18-1', '普专临床医学18-2', '普专临床药学18-5', '普专药学18-2', '普专药剂18-1', '普专中药18-2', '普专药销18-1', '普专助产18-1', '普专对口护理18-1', '普专临床医学18-1', '普专对口护理18-2', '普专对口护理18-3', '普专对口护理18-4', '普专食检18-1', '普专口腔护理18-1', '涉外护理18-1', '普专老年保健18-1(华录班)', '普专康复技术18-2', '普专老年保健18-2(对马班)', '普专机械18-1', '普专数控(鸿准)18-2', '普专汽车18-1', '普专汽车18-2', '普专汽车18-3', '普专数控18-1', '普专机电18-1', '普专智能交通18-1', '普专智能交通18-2', '普专机器人18-1', '普专商务18-1', '普专工商18-1', '普专会计18-1', '普专会计18-2', '普专会计18-3', '普专中药18-1', '普专会计18-4', '普专会计18-5', '普专物流18-1', '普专动画18-1', '普专造价18-1', '普专农检18-1', '普专农检(定向)18-2', '普专农检(定向)18-3', '普专财务18-1', '普专财务18-2', '普专旅游18-1', '普专旅游18-2', '普专酒店(现代学徒制)18-1', '普专酒店18-2', '普专广告18-1', '普专导游18-1', '普专导游18-2', '普专环艺18-1', '普专空乘18-1', '普专烹调18-1', '普专运动休闲18-1', '普专电子18-1', '普专电子18-2', '普专物联网18-1', '普专通信18-2', '普专通信18-3', '普专通信18-4', '普专通信18-5', '普专移动应用18-1', '普专中医18-1', ];

(async () => {
    await util.BuildDatabase(true);
    await db.Grade.create({
        Name: '2018'
    });
    await db.Grade.create({
        Name: '2019'
    });
    await db.Questionnaire.create({
        Name: '乐山职业技术学院学生满意度调查表',
        CreatedBy: '督导处'
    });
    await db.Faculty.bulkCreate(require('./data/Faculty.json'));
    let major = require('./data/Major.json');
    for (let cls of major) {
        cls.FacultyId = faculties.indexOf(cls.Faculty) + 1,
            delete cls.Faculty;
    }
    await db.Major.bulkCreate(major);
    let classInfo = require('./data/Class.json');
    for (let cls of classInfo) {
        cls.MajorId = majors.indexOf(cls.Major) + 1;
        let majorDb = await db.Major.findByPk(cls.MajorId);
        cls.FacultyId = majorDb.FacultyId;
        cls.GradeId = 1;
        delete cls.Major;
        let clsTotal = await db.Student.count({
            where: {
                Class: cls.Name
            }
        });
    }
    await db.ClassInfo.bulkCreate(classInfo);

    let students = require('./data/Student.json');
    for (let stu of students) {
        delete stu.CreatedAt;
        delete stu.UpdatedAt;
        stu.ClassId = classes.indexOf(stu.Class) + 1;
        stu.GradeId = 1;
    }
    await db.Student.bulkCreate(students);

    let clses = await db.ClassInfo.findAll();
    for (let cls of clses) {
        cls.Total = await db.Student.count({
            where: {
                ClassId: cls.Id
            }
        });
        await cls.save();
    }

    await db.Question.bulkCreate(require('./data/Question.json'));

    let classinfoes = await db.ClassInfo.findAll({
        include: [db.Major]
    });
    let questions = await db.Question.findAll();
    let facties = await db.Faculty.findAll();
    for (let cls of classinfoes) {
        for (let qst of questions) {
            await db.AnswerStatistics.create({
                ClassId: cls.Id,
                QuestionId: qst.Id,
                FacultyId: cls.Major.FacultyId
            })
        }
    }
    for (let flty of facties) {
        for (let gradeId of [1, 2]) {
            let total = await db.Student.count({
                where: {
                    Faculty: flty.Name,
                    GradeId: gradeId
                }
            })
            db.CountStatistics.create({
                FacultyId: flty.Id,
                Total: total,
                GradeId: gradeId
            })
        }
    }
})();