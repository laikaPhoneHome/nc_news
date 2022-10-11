const db = require('../db/connection');
const { articleData } = require('../db/data/test-data');

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({rows: topics}) => {
        return topics;
    })
}

exports.fetchArticles = (topic, sort_by, order) => {
    
    let defaultQuery = `
    SELECT articles.*, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id `

    if(topic){
        defaultQuery += ` WHERE articles.topic = $1 `
    }


    let sortByQuery = ` 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`

    if(sort){
        sortByQuery = ` 
        GROUP BY articles.article_id
        ORDER BY articles.created_at = $2;`
    }
    const order
    if(order.toUpperCase() === ''){

    }
    defaultQuery += orderQuery;
    
    if(topic){
        return db.query(defaultQuery,[topic]).then(({rows: articles}) => {
            return articles;
        })
    }else {
        return db.query(defaultQuery).then(({rows: articles}) => {
            return articles;
        })
    }
}

exports.selectArticle = (id) => {
    const numID = Number(id)

    if(isNaN(numID)){
        return Promise.reject({status: 400, msg: 'Invalid Article Id'});
    }
    return db.query(`
    SELECT articles.*, COUNT(comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments 
        ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1  GROUP BY articles.article_id;
    `, [id])
    .then(({rows: [article]}) => {
        if(!article){
            return Promise.reject({status: 404, msg: 'Article Not Found'});
        }
        return article;
    })
}

exports.fetchUsers = () => {
    return db.query(`
    SELECT * FROM users;
    `)
    .then(({rows: users}) => {
        return users;
    })
}

exports.updateArticle = (votes, id) => {
    const numID = Number(id);
    const numVotes = Number(votes);

    if(isNaN(numVotes)){
        return Promise.reject({status: 400, msg: 'Invalid Vote Count'})
    }

    if(isNaN(numID)){
        return Promise.reject({status: 400, msg: 'Invalid ID'});
    }

    return db.query(`
    UPDATE articles
    SET votes = $1
    WHERE article_id = $2
    RETURNING *;
    `, [votes, id])
    .then(({rows: [article]}) => {
        if(!article){
            return Promise.reject({status: 404, msg: 'Not Found'});
        }
        return article;
    })
}