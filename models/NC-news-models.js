const db = require('../db/connection');
const { articleData } = require('../db/data/test-data');

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({rows: topics}) => {
        return topics;
    })
}

exports.fetchArticles = (topic, sort_by = 'created_at', order = 'DESC', p = 1, limit = 10) => {
    const validCategory = ['title', 'topic', 'author', 'body', 'created_at', 'votes'];
    const validOrder = ['ASC', 'DESC'];
    const queries = [];
    if(isNaN(Number(p))){
        return Promise.reject({status: 400, msg: 'Invalid Page'})
    }

    p -= 1;
    const offset = limit * p;

    if(!validCategory.includes(sort_by)){
        return Promise.reject({status: 400, msg: "Invalid Sort Category"})
    }
    if(!validOrder.includes(order.toUpperCase())){
        return Promise.reject({status: 400, msg: "Invalid Order"})
    }

    let defaultQuery = `
    SELECT articles.*, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments 
        ON articles.article_id = comments.article_id `

    topic ? 
      queries.push(` 
    WHERE articles.topic = $1 
    GROUP BY articles.article_id  
    ORDER BY ${sort_by} ${order.toUpperCase()}
    `)
    : queries.push(`
    GROUP BY articles.article_id  
    ORDER BY ${sort_by} ${order.toUpperCase()}
    `)

    topic ?
    queries.push(`LIMIT $2 OFFSET $3;
    `)
    :
    queries.push(`LIMIT $1 OFFSET $2;
    `)

    defaultQuery += queries.join('');


    if(topic){
        
        const articleCount = db.query(`
        SELECT COUNT(*) FROM articles 
        WHERE topic = $1;
        `, [topic])

        const selectQuery = db.query(defaultQuery,[topic, limit, offset])
           
        return Promise.all([articleCount, selectQuery]).then(([{rows: [{count}]},{rows: articles}]) => {
            return {total_count: count, articles};
        })

    } else {

        const articleCount = db.query(`
        SELECT COUNT(*) FROM articles;
        `)

        const selectQuery = db.query(defaultQuery,[limit, offset])
        
        return Promise.all([articleCount, selectQuery]).then(([{rows: [{count}]}, {rows: articles}]) => {
            return {total_count: count, articles};
        })
    }
}

exports.selectArticle = (id) => {
    const numID = Number(id);

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

exports.insertArticle = (article) => {
    const { author, title, body, topic } = article;
    const validKeys = ['author', 'title', 'body', 'topic'];
    for(let i=0; i<4; i++){
        if(article[validKeys[i]] === undefined){
            return Promise.reject({status: 400, msg: `Invalid Article ${validKeys[i].charAt(0).toUpperCase() + validKeys[i].slice(1)}`})
        }
    }
    
    
    return db.query(`
    INSERT INTO articles (author, title, body, topic)
    VALUES ($1, $2, $3, $4)
    RETURNING article_id;
    `,[author, title, body, topic])
    .then(({rows: [{article_id}]}) => {
        if(!article_id){
            return Promise.reject({status: 400, msg: 'Invalid Article'})
        }
        return db.query(`
    SELECT articles.*, COUNT(comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments 
        ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1  GROUP BY articles.article_id;
    `, [article_id])
    .then(({rows: [article]}) => {
        return article;
    })
})
}

exports.selectComment = (id) => {
    if(isNaN(Number(id))){
        return Promise.reject({status: 400, msg: "Invalid Comment Id"})
    }
    return db.query(`
    SELECT * FROM comments
    WHERE comment_id = $1;
    `, [id])
    .then(({rows: [comment]}) => {
        return comment;
    })
    .catch((err) => {
        next(err);
    })
}

exports.fetchComments = (article) => {
    return db.query(`
    SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments 
        LEFT JOIN articles
        ON articles.article_id = comments.article_id
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC;
    `,[article])
    .then(({rows: comments}) => {
        return comments;
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

exports.selectUser = (username) => {
    return db.query(`
    SELECT * FROM users
    WHERE username = $1;
    `, [username]).then(({rows: [user]}) => {
        if(!user){
            return Promise.reject({status: 404, msg: "Username Not Found"})
        }
        return user;
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
    SET votes = votes + $1
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

exports.insertComment = (username, body, article_id) => {
    return db.query(`
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING body, votes, author, comment_id, created_at;
    `,[username, body, article_id])
    .then(({rows: [comment]}) => {
        return comment;
    })
}

exports.updateComment = (id, votes) => {
    return db.query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;
    `, [votes, id])
    .then(({rows: [comment]}) => {
        if(!comment){
            return Promise.reject({status: 404, msg: 'Comment Not Found'});
        }
        return comment;
    })
}

exports.removeComment = (id) => {
    if(isNaN(Number(id))){
        return Promise.reject({status: 400, msg: "Invalid Comment Id"})
    }
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `,[id]).then(({rows: [comment]}) => {
        if(!comment){
            return Promise.reject({status: 404, msg: 'Comment Not Found'})
        } else {
            return;
        }
    })
}