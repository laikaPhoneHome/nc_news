const db = require('../db/connection');

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({rows: topics}) => {
        return topics;
    })
}

exports.fetchArticleById = (id) => {
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1;
    `, [id])
    .then(({rows: [article]}) => {
        if(!article){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return article
    })
}