module.exports = (sequelize, DataTypes) => {
    var Answer = sequelize.define('Answer', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        Select:{
            type: DataTypes.STRING,
            allowNull:false
        },
        Text:{
            type: DataTypes.TEXT,
            allowNull:true
        }        
    },{
        updatedAt:'UpdatedAt',
        createdAt:'CreatedAt'
    })
    Answer.associate = function(models){
        models.Answer.belongsTo(models.Student,{
            onDelete: "CASCADE",
            foreignKey: {
                name: 'StudentId',
                allowNull: false
            }
        });
        models.Answer.belongsTo(models.Question,{
            onDelete: "CASCADE",
            foreignKey: {
                name: 'QuestionId',
                allowNull: false
            }
        });
    };

   return Answer;
}
