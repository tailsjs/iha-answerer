const AnswerDatabase = require("./src/index")

const AnswerDB = new AnswerDatabase()

const question = "Че как?"

console.log("Вопрос:", question)

console.log(AnswerDB.getMaxValidAnswer(question))