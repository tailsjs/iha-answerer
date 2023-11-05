const AnswerDatabase = require("./index")
const path = require("node:path")
const {
	database
} = require("./config.json")

const AnswerDB = new AnswerDatabase(path.join(__dirname + database))

const question = "Привет!"

console.log("Вопрос:", question)

console.log(AnswerDB.getMaxValidAnswer(question))