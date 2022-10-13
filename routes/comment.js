const commentRouter = require('express').Router();
const app = require('../app');
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
    updateComment
    } = require('../models/NC-news-models');


commentRouter
    .route('/')
    .get((req, res) => {
        const { comment_id } = req.params;
        selectComment(comment_id).then((comment) => {
            res.status(200).send({comment});
        })
        .catch((err) => {
            next(err);
        })
    })
    .patch((req, res, next) => {
    })
    .delete((req, res) => {
        
    })
    .post((req, res, next) => {
    
    })

commentRouter
    .route('/:comment_id')
    .delete((req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id).then(() => {
        res.status(204).send({});
    })
    .catch((err) => {
        next(err);
    })
    })
    .get((req, res, next) => {
        const { comment_id } = req.params;
        
        selectComment(comment_id).then((comment) => {
            res.status(200).send({comment});
        })
        .catch((err) => {
            next(err);
        })
    })
    .patch((req, res, next) => {
        const { comment_id } = req.params;
        const { inc_votes } = req.body;
        updateComment(comment_id, inc_votes).then((comment) => {
            res.status(202).send({comment})
        })
        .catch((err) => {
            next(err);
        })
    })

module.exports = commentRouter;