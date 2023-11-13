const AnswerDatabase = require("./src/index")

const AnswerDB = new AnswerDatabase()

const question = "Привет!"

console.log("Вопрос:", question)

console.log(AnswerDB.getMaxValidAnswer(question))