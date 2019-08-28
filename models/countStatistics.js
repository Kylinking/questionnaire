module.exports = (sequelize, DataTypes) => {
    var CountStatistics = sequelize.define('CountStatistics', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        Total:{
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        Submit:{
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },      
    },{
        updatedAt:'UpdatedAt',
        createdAt:'CreatedAt'
    })
    CountStatistics.associate = function(models){
        models.CountStatistics.belongsTo(models.Faculty,{
            onDelete: "CASCADE",
            foreignKey: {
                name: 'FacultyId',
                allowNull: false,
                unique:true
            }
        });
    };

   return CountStatistics;
}