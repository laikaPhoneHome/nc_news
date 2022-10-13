const app = require('./app')

app.listen(process.env.port || 3060, () => {
	console.log(`app listening on ${process.env.port}`)
})