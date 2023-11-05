const express = require('express')
const config = require("../config.json")
const path = require("node:path")
const fs = require("fs")
const app = express()
const port = config.learning_server.port

app.use(express.urlencoded({
	extended: true
}))
app.use(express.json())

app.use('/', express.static("public"))

app.use("/api/getUnknownWords", async (req, res) => {
	res.send(fs.readFileSync("../unknown.json").toString())
})

app.post("/api/learn", async (req, res) => {
	const body = req.body
	let database = fs.readFileSync(path.join(".." + config.database)).toString()
	let unknown = JSON.parse(fs.readFileSync("../unknown.json").toString())

	database += `\n${body.word}\\${body.data}\\0`

	fs.writeFileSync(path.join(".." + config.database), database)

	if (body.unknown) {
		unknown = unknown.filter(e => e != body.word)
		fs.writeFileSync("../unknown.json", JSON.stringify(unknown, "\n", 4))
	}

	console.log("Learned: ", body.word, "-", body.data)

	res.send({
		ok: true
	})
})

app.post("/api/delete", async (req, res) => {
	const body = req.body
	let unknown = JSON.parse(fs.readFileSync("../unknown.json").toString())

	unknown = unknown.filter(e => e != body.word)

	fs.writeFileSync("../unknown.json", JSON.stringify(unknown, "\n", 4))

	res.send({
		ok: true
	})
})

app.listen(port, () => {
	console.log(`Learning server listening on port ${port}. Let's learn on http://127.0.0.1:${port}`)
})