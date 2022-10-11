const { fetchTopics, selectArticle, fetchUsers, updateArticle, fetchArticles } = require('../models/NC-news-models')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch((err) => {
        next(err);
    })
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles });
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