const express = require('express')
const { learningServerPort: port, unknownFile, databaseFile, synonimousFile } = require("../config")
const fs = require("fs")
const app = express()

app.use(express.urlencoded({
	extended: true
}))
app.use(express.json())

app.use('/', express.static("public"))

app.use("/api/getUnknownWords", async (req, res) => {
	res.send(fs.readFileSync(unknownFile).toString())
})

app.use("/api/getAllSynonimous", async (req, res) => {
	res.send(fs.readFileSync(synonimousFile).toString())
})

app.post("/api/learn", async (req, res) => {
	const body = req.body
	let database = fs.readFileSync(databaseFile).toString()
	let unknown = JSON.parse(fs.readFileSync(unknownFile).toString())

	database += `\n${body.word}\\${body.data}\\0`

	fs.writeFileSync(databaseFile, database)

	if (body.unknown) {
		unknown = unknown.filter(e => e != body.word)
		fs.writeFileSync(unknownFile, JSON.stringify(unknown, "\n", 4))
	}

	console.log("Learned:", body.word, "-", body.data)

	res.send({
		ok: true
	})
})

app.post("/api/synonimous", async (req, res) => {
	const body = req.body
	let database = fs.readFileSync(synonimousFile).toString().replaceAll("\r", "")

	let splittedDatabase = database.split("\n")

	let mainSynonimous = splittedDatabase.map(synonimous => synonimous.split("\\")[0])
	
	if(!database.includes(body.word) && body.main == "_addNew") {
		database += `\n${body.word}`
	}else{
		const synonimousIndex = mainSynonimous.indexOf(body.main)
		if(synonimousIndex === -1 || splittedDatabase[synonimousIndex].includes(body.word)) {
			return res.send({
				ok: false
			})
		}

		splittedDatabase[synonimousIndex] += `\\${body.word}`

		database = splittedDatabase.join("\n")
	}

	fs.writeFileSync(synonimousFile, database)

	res.send({
		ok: true
	})
})

app.post("/api/delete", async (req, res) => {
	const body = req.body
	let unknown = JSON.parse(fs.readFileSync(unknownFile).toString())

	unknown = unknown.filter(e => e != body.word)

	fs.writeFileSync(unknownFile, JSON.stringify(unknown, "\n", 4))

	res.send({
		ok: true
	})
})

app.post("/api/login", async (req, res) => {
	// Later.
	res.send("Go away!")
})

app.listen(port, () => {
	console.log(`Learning server listening on port ${port}. Let's learn on http://127.0.0.1:${port}`)
})