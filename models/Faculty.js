module.exports = (sequelize, DataTypes) => {
    var Faculty = sequelize.define('Faculty', {
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
    Faculty.associate = function (models) {
        models.Faculty.hasOne(models.Major, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'FacultyId',
                allowNull: false
            }
        });
    }
    return Faculty;
}