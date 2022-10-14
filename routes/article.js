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
    insertArticle,
    removeArticle
    } = require('../models/NC-news-models');
const app = require('../app');
const articleRouter = require('express').Router();


articleRouter
    .route('/')
    .get((req, res, next) => {
    const { topic, sort_by, order, p, limit} = req.query;

    const promises = [fetchArticles(topic, sort_by, order, p, limit)]

    if(topic){
        promises.push(fetchTopics())
    }

    Promise.all(promises).then(([articles, topics]) => {
        if(topics){
            let validTopic = false;
            topics.forEach(type => {
                if(type.slug === topic){
                    validTopic = true;
                }
            })
            if(!validTopic){
                return Promise.reject({ status: 400, msg: 'Invalid Topic' });
            }
            else
            {
                if(articles.total_count < limit * p + 1){
                    res.status(200).send({ message: 'No Content'})
                }else {
                    res.status(200).send({ articles });
                }
            }
        }
        else 
        {
            if(articles.total_count < limit * p + 1){
                res.status(200).send({ message: 'No Content'})
            }else {
                res.status(200).send({ articles });
            }
        }
    })
    .catch((err) => {
        next(err);
    })
    })
    .post((req, res, next) => {
        insertArticle(req.body).then((article) => {
            res.status(202).send({article});
        })
        .catch((err) => {
            next(err);
        })
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
    .delete((req, res, next) => {
        const { article_id } = req.params;
        removeArticle(article_id).then(() => {
            res.status(204).send({});
        })
        .catch((err) => {
            next(err);
        })
    })

articleRouter
    .route('/:article_id/comments')
    .get((req, res, next) => {
        const { article_id } = req.params;
        const { p, limit} = req.query;


        const promises = [fetchComments(article_id, p, limit), 
            selectArticle(article_id)];
    
        Promise.all(promises).then(([comments, article]) => {
            res.status(200).send({comments});
        })
        .catch((err) => {
            next(err);
        })
     })
     .post((req, res, next) => {
        const { article_id } = req.params;

        const promises = [selectArticle(article_id), insertComment(req.body, article_id)]

        return Promise.all(promises).then(([article, comment]) => {
            res.status(201).send({comment});
        })
        .catch((err) => {
            next(err);
        })
    })

module.exports = articleRouter;