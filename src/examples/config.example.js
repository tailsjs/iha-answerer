const path = require("node:path")

// Порт для панельки обучения базы.
const learningServerPort = 1666
// Игнорировать "Что?", если степень схожести 20% и меньше.
const ignore02 = false
// Расположение файла с запросами, которых нет в базе ответов. Необходимо указывать с "/" в начале!
const unknownFile = "/unknown.json"
// Расположение вашей базы ответов. Необходимо указывать с "/" в начале!
const databaseFile = "/databases/answer_databse.bin"
// Расположение вашей базы синонимов. Необходимо указывать с "/" в начале!
const synonimousFile = "/data/synonimous.txt"

module.exports = {
    learningServerPort,
    ignore02,
    unknownFile: path.join(__dirname + unknownFile),
    databaseFile: path.join(__dirname + databaseFile),
    synonimousFile: path.join(__dirname + synonimousFile)
}