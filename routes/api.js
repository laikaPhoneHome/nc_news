const apiRouter = require('express').Router();
const endpoints = require('../endpoints.json');

const commentRouter = require('./comment');
const topicRouter = require('./index')

// apiRouter.use('/topics', topicRouter);
// apiRouter.use('/comments', commentRouter);

apiRouter
    .route('/')
    .get((req, res) => {
        console.log('api router')
        res.status(200).send({endpoints});
    })
    .post((req, res) => {
    })
    .patch((req, res) => {
    })

module.exports = apiRouter;