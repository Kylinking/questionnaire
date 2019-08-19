module.exports = (sequelize, DataTypes) => {
    var Major = sequelize.define('Major', {
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
    Major.associate = function (models) {
        models.Major.hasOne(models.ClassInfo, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'MajorId',
                allowNull: false
            }
        });
        models.Major.belongsTo(models.Faculty, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'FacultyId',
                allowNull: false
            }
        });
    }
    return Major;
}