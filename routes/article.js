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
    } = require('../models/NC-news-models');
const app = require('../app');
const articleRouter = require('express').Router();

// const commentRouter = require('./comment');

// articleRouter.use('/comments', commentRouter)

articleRouter
    .route('/')
    .get((req, res, next) => {
        const { topic } = req.query;
    const { sort_by } = req.query;
    const { order } = req.query;

    const promises = [fetchArticles(topic, sort_by, order)]

    if(topic){
        promises.push(fetchTopics())
    }

    Promise.all(promises).then((promises) => {
        if(promises[1]){
            let validTopic = false;
            promises[1].forEach(promise => {
                if(promise.slug === topic){
                    validTopic = true;
                }
            })
            if(!validTopic){
                return Promise.reject({ status: 400, msg: 'Invalid Topic' });
            }
            else
            {
                res.status(200).send({ articles: promises[0] });
            }
        }
        else 
        {
            res.status(200).send({ articles: promises[0] });
        }
    })
    .catch((err) => {
        next(err);
    })
    })
    .post((req, res) => {
    })
    .patch((req, res) => {
    })
    .delete((req, res) => {
    })

articleRouter
    .route('/:article_id')
    .get((req, res, next) => {
        const { article_id } = req.params;
    selectArticle(article_id).then((article) => {
        res.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    })
    })
    .post((req, res) => {
    })
    .patch((req, res, next) => {
        const { inc_votes } = req.body;
        const { article_id } = req.params;
        updateArticle(inc_votes, article_id).then((article) => {
            res.status(202).send({article})
        })
        .catch((err) => {
            next(err);
        })
    })
    .delete((req, res) => {
    })

articleRouter
    .route('/:article_id/comments')
    .get((req, res, next) => {
        const { article_id } = req.params;

        const promises = [fetchComments(article_id), 
            selectArticle(article_id)];
    
        Promise.all(promises).then(([comments, article]) => {
            res.status(200).send({comments});
        })
        .catch((err) => {
            next(err);
        })
     })
     .post((req, res, next) => {
        const { username, body } = req.body;
        const { article_id } =req.params;
 
     const promises = [selectArticle(article_id), insertComment(username, body, article_id)]
 
     return Promise.all(promises).then(([article, comment]) => {
         res.status(201).send({comment});
     })
     .catch((err) => {
         next(err);
     })
    })

module.exports = articleRouter;