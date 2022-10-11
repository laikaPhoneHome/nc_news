const express = require('express');
const app = express();

const { getTopics, getArticleById } = require('./controllers/NC-news-controllers.js')

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);


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

