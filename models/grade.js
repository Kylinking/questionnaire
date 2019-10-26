module.exports = (sequelize, DataTypes) => {
    var Grade = sequelize.define('Grade', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
            updatedAt: 'UpdatedAt',
            createdAt: 'CreatedAt'
        })
    Grade.associate = function (models) {
        models.Grade.hasOne(models.ClassInfo, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'GradeId',
                allowNull: false
            }
        });
    }
    return Grade;
}