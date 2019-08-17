module.exports = (sequelize, DataTypes) => {
    var Questionnaire = sequelize.define('Questionnaire', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CreatedBy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
            updatedAt: 'UpdatedAt',
            createdAt: 'CreatedAt'
        })
    Questionnaire.associate = function (models) {
        models.Questionnaire.hasOne(models.Question, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'QuestionnaireId',
                allowNull: false
            }
        });
    }
    return Questionnaire;
}
