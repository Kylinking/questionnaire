module.exports = (sequelize, DataTypes) => {
    var Question = sequelize.define('Question', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Index: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Department: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
            updatedAt: 'UpdatedAt',
            createdAt: 'CreatedAt'
        })

    Question.associate = function (models) {
        models.Question.belongsTo(models.Questionnaire, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'QuestionnaireId',
                allowNull: false
            }
        });
    }
    return Question;
}
