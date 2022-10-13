const apiRouter = require('express').Router();
const endpoints = require('../endpoints.json');

const {
    commentRouter, 
    topicRouter, 
    articleRouter,
    userRouter
} = require('./index')


apiRouter.use('/topics', topicRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', userRouter)
// apiRouter.use('/articles\/:article_id\/comments', commentRouter);

apiRouter
    .route('/')
    .get((req, res) => {
        res.status(200).send({endpoints});
    })
    .post((req, res) => {
    })
    .patch((req, res) => {
    })

module.exports = apiRouter;