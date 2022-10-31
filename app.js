const express = require('express');
const app = express();
const cors = require('cors');

const apiRouter = require('./routes/api');

app.use(express.json());
app.use(cors());

app.use('/api', apiRouter);


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
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send({message: 'Internal Server Error'});
})


module.exports = app;

