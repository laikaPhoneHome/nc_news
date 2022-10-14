const { 
    fetchTopics, 
    selectArticle, 
    fetchUsers, 
    updateArticle, 
    fetchArticles, 
    fetchComments,
    insertComment,
    removeComment,
    selectComment,
    insertTopic
    } = require('../models/NC-news-models');
const app = require('../app');

const topicRouter = require('express').Router();

topicRouter
    .route('/')
    .get((req, res, next) => {
        fetchTopics().then((topics) => {
            res.status(200).send({topics});
        })
        .catch((err) => {
            next(err);
        })
    })
    .post((req, res, next) => {
        insertTopic(req.body).then((topic) => {
            res.status(202).send({topic});
        })
        .catch((err) => {
            next(err);
        })
    })
    .patch((req, res) => {
    })
    .delete((req, res) => {
    })


module.exports = topicRouter;

