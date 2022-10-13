const app = require('./app')

app.listen(process.env.port || 9090, () => {
	console.log('app listening')
})