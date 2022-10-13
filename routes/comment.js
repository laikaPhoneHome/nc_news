const commentRouter = require('express').Router();
const app = require('../app');

commentRouter
    .route('/')
    .get((req, res) => {
       const { comment_id } = req.params;

       selectComment(comment_id).then((comment) => {
           res.status(200).send({comment});
       })
    })
    .post((req, res, next) => {
    const { username, body } = req.body;
    const { article_id } =req.params;

    const promises = [selectArticle(article_id), insertComment(username, body, article_id)]

    return Promise.all(promises).then(([article, comment]) => {
        res.status(201).send({comment});
    })
    })
    .patch((req, res) => {
    })
    .delete((req, res) => {
    })

module.exports = commentRouter;