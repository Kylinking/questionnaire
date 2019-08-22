'use strict';

const express = require('express');
const router = express.Router();

router.get('/questions', async (req, res) => {
    let { db, logger } = { ...res.locals };
    try { 
    let Questions = await db.Question.findAll();
    res.json({
        Data: {
            Questions
        }
    }).end();
}catch (error) {
    logger.error(error);
}
})


router.use((req, res, next) => {
    next();
})

module.exports = router;