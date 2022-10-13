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
    selectUser
    } = require('../models/NC-news-models');
const userRouter = require('express').Router();

userRouter  
    .route('/')
    .get((req, res, next) => {
        fetchUsers().then((users) => {
            res.status(200).send({users})
        })
        .catch((err) => {
            next(err);
        })
    })

userRouter
    .route('/:username')
    .get((req, res, next) => {
        const { username } = req.params;
        selectUser(username).then((user) => {
            res.status(200).send({user});
        })
        .catch((err) => {
            next(err);
        })
    })

module.exports = userRouter;