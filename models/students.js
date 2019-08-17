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
    },{
        updatedAt:'UpdatedAt',
        createdAt:'CreatedAt'
    })
   return Student;
}
