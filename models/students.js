module.exports = (sequelize, DataTypes) => {
    var Student = sequelize.define('Student', {
        Id: {
            type: DataTypes.STRING(16),
            primaryKey: true,
            allowNull: false,
        },
        Name:{
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        Gender:{
            type: DataTypes.STRING(2),
            allowNull: false,
        },
        Major:{
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        Faculty:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        Class:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        Submit:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0
        }
    },{
        updatedAt:'UpdatedAt',
        createdAt:'CreatedAt'
    })
    Student.associate = function(models){
    models.Student.belongsTo(models.ClassInfo, {
        onDelete: "CASCADE",
        foreignKey: {
            name: 'ClassId',
            allowNull: false
        }
    });
}
   return Student;
}
