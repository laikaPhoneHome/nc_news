const app = require('./app')

app.listen(process.env.PORT || 3060, () => {
	console.log(`app listening on ${process.env.PORT || 3060}`)
})