const { 
    fetchTopics, 
    selectArticle, 
    fetchUsers, 
    updateArticle, 
    fetchArticles, 
    fetchComments,
    insertComment,
    removeComment,
    selectComment
    } = require('../models/NC-news-models')
const topicRouter = require('express').Router();

topicRouter
    .route('/')
    .get((req, res, next) => {
        fetchTopics().then((topics) => {
            res.status(200).send({topics})
        })
    });


module.exports = topicRouter;

