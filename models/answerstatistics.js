module.exports = (sequelize, DataTypes) => {
    var AnswerStatistics = sequelize.define('AnswerStatistics', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        ExtremelySatisfied:{
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        Satisfied:{
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },      
        Unsatisfied:{
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        ExtremelyUnsatisfied:{
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
    },{
        updatedAt:'UpdatedAt',
        createdAt:'CreatedAt'
    })
    AnswerStatistics.associate = function(models){
        models.AnswerStatistics.belongsTo(models.Faculty,{
            onDelete: "CASCADE",
            foreignKey: {
                name: 'FacultyId',
                allowNull: false,
            }
        });
        models.AnswerStatistics.belongsTo(models.Question,{
            onDelete: "CASCADE",
            foreignKey: {
                name: 'QuestionId',
                allowNull: false,
                unique:'class_question'
            }
        });
        models.AnswerStatistics.belongsTo(models.ClassInfo,{
            onDelete: "CASCADE",
            foreignKey: {
                name: 'ClassId',
                allowNull: false,
                unique:'class_question'
            }
        });
    };

   return AnswerStatistics;
}