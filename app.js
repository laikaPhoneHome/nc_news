const express = require('express');
const app = express();

const { getTopics, getArticleById, getUsers, patchArticleById, getArticles } = require('./controllers/NC-news-controllers.js')

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/users', getUsers);

app.patch('/api/articles/:article_id', patchArticleById);



app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({message: err.msg})
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send({message: 'Internal Server Error'});
})


module.exports = app;

