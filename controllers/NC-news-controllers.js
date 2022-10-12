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
const { createRef } = require('../db/seeds/utils')
let commentData = require('../db/data/development-data/comments')
if(process.env.NODE_ENV === 'test'){
    commentData = require('../db/data/test-data/comments')
}
const endpoints = require('../endpoints.json');

exports.getEndpoints = (req, res, next) => {
    res.status(200).send({endpoints});
}

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch((err) => {
        next(err);
    })
}

exports.getArticles = (req, res, next) => {
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
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticle(article_id).then((article) => {
        res.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    })
}

exports.getCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    selectComment(comment_id).then((comment) => {
        res.status(200).send({comment});
    })
    .catch((err) => {
        next(err);
    })
}
exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    const promises = [fetchComments(article_id), 
        selectArticle(article_id)];

    Promise.all(promises).then(([comments, article]) => {
        res.status(200).send({comments});
    })
    .catch((err) => {
        next(err);
    })
}

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err);
    })
}

exports.patchArticleById = (req, res, next) => {
    const { inc_votes } = req.body;
    const { article_id } = req.params;
    updateArticle(inc_votes, article_id).then((article) => {
        res.status(202).send({article})
    })
    .catch((err) => {
        next(err);
    })
}

exports.postCommentByArticleId = (req, res, next) => {
    const { username, body } = req.body;
    const { article_id } =req.params;

    const promises = [selectArticle(article_id), insertComment(username, body, article_id)]

    return Promise.all(promises).then(([article, comment]) => {
        res.status(201).send({comment});
    })
    .catch((err) => {
        next(err);
    })
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    removeComment(comment_id).then(() => {
        res.status(204).send({});
    })
    .catch((err) => {
        next(err);
    })
}