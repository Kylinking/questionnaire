const db = require('../models').db;
const redisClient = require('../models').redisClient;
const util = {
    BuildDatabase: async function (force) {
        await db.sequelize.sync({ force: force || false });
    },
    MakeErrorResponse: function (message) {
        return {
            Error: {
                Message: message
            }
        }
    },
    MakeResponse: function (body, message) {
        return {
            Data: {
                Message: message || 'OK',
                ...body
            }
        }
    },
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
    RedisGetAsync:async function(key){
        const {
            promisify
        } = require('util');
        let redisGet = promisify(redisClient.get).bind(redisClient);
        return await redisGet(key);
    }
}
module.exports = util;