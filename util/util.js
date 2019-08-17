var db = require('../models').db;

var util = {
    checkInt: function (value) {
        if (/^(\-|\+)?([0-9]+\.)?([0-9]+|Infinity)$/.test(value))
            return Number(value);
        return NaN;
    },
    checkPhone: function (value) {
        if (/^[0-9]{3,4}-?[0-9]{0,7}$/.test(value))
            return value;
        return NaN;
    },
    makeNumericValue: function (originValue, defaultValue) {
        let temp = this.checkInt(originValue);
        if (isNaN(temp)) return defaultValue;
        return temp;
    },
    BuildDatabase:async function(force){
        await db.sequelize.sync({force});
    }
}
module.exports = util;