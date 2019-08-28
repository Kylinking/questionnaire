module.exports = (sequelize, DataTypes) => {
    var ClassInfo = sequelize.define('ClassInfo', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Total:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        Submit:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        Grade:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
            updatedAt: 'UpdatedAt',
            createdAt: 'CreatedAt'
    })
    ClassInfo.associate = function (models) {
        models.ClassInfo.hasOne(models.Student, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'ClassId',
                allowNull: false
            }
        });
        models.ClassInfo.belongsTo(models.Major, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'MajorId',
                allowNull: false
            }
        });
        models.ClassInfo.belongsTo(models.Faculty, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'FacultyId',
                allowNull: false
            }
        });
    }
    return ClassInfo;
}