const express = require('express');
const app = express();

const { 
    getTopics,
    getArticleById,
    getUsers,
    patchArticleById,
    getArticles,
    getCommentsByArticleId,
    postCommentByArticleId 
} = require('./controllers/NC-news-controllers.js')

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.get('/api/users', getUsers);

app.patch('/api/articles/:article_id', patchArticleById);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);


app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({message: err.msg});
    } else {
        next(err);
    }
})
app.use((err, req, res, next) => {
    if(err.code === '23503'){
        res.status(400).send({message: 'Invalid User'});
    }
})

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send({message: 'Internal Server Error'});
})


module.exports = app;

