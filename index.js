const fs = require("fs")
const unknown = require("./unknown.json")

class AnswerDatabase {
	answers = []

	constructor(path) {
		const file = fs.readFileSync(path).toString()
		const lines = file.split("\n")

		MessagePreparer.load()

		this.answers = lines.map(e => new AnswerElement(e))
	}

	getMaxValidAnswer(message) {
		if (message.length == 0) {
			return "Что?"
		}

		const originalMessage = message;

		let max = 0
		let maxes = []

		message = MessagePreparer.processMessageBeforeComparation(message)

		for (let answer of this.answers) {
			const validity = MessageComparer.compareMessages(answer.getPreparedKeywords(), message, true, true)
			if (validity > max) {
				max = validity
				maxes = []
			}

			if (validity == max) {
				maxes.push(answer)
			}
		}
		console.log("Отобрано", maxes.length, "сообщений со степенью схожести", max * 100, "%")

		if (max < 0.2) {
			return "Что?"
		}

		if (max < 0.7) {
			this.addToUnknown(originalMessage)
			return "Unknown!"
		}

		if (maxes.length == 0) {
			return "Empty base!"
		}

		return maxes[this.random(0, maxes.length - 1)].text
	}

	addToUnknown(word) {
		if (!unknown.includes(word)) {
			unknown.push(word)
			this.saveUnknown()
		}
	}

	saveUnknown() {
		fs.writeFileSync("./unknown.json", JSON.stringify(unknown, "\n", 4))
	}

	random(min, max) {
		return Math.round(Math.random() * (max - min)) + min
	}
}

class AnswerElement {
	text = ""
	keywords = []
	repeats = 0
	preparedKeywords = null

	constructor(parceable) {
		const parts = parceable.split("\\")

		this.keywords = parts[0].split("\\ ")
		this.text = parts[1]
		this.repeats = Number(parts[2])
	}

	getPreparedKeywords() {
		if (this.preparedKeywords == null) {
			return this.prepareKeywords()
		}
		return this.preparedKeywords
	}

	prepareKeywords() {
		let result = ""
		for (let keyword = 0; keyword < this.keywords.length; keyword++) {
			result += this.keywords[keyword]
			if (keyword < this.keywords.length - 1) {
				result += " "
			}
		}
		result = MessagePreparer.processMessageBeforeComparation(result)

		this.preparedKeywords = result

		return result
	}
}

class MessageComparer {
	static compareMessages(message1, message2, message1prepared = false, message2prepared = false) {
		message1 = message1prepared ? message1 : MessagePreparer.processMessageBeforeComparation(message1)
		message2 = message2prepared ? message2 : MessagePreparer.processMessageBeforeComparation(message2)

		let message1Keywords = this.trimArray(message1.split("\\ "))
		let message2Keywords = this.trimArray(message2.split("\\ "))

		return this.comparePattern(message1Keywords, message2Keywords)
	}

	static comparePattern(message, pattern) {
		const matrix = this.createMatrix(message.length, pattern.length)

		for (let messageWord = 0; messageWord < message.length; messageWord++) {
			for (let patternWord = 0; patternWord < pattern.length; patternWord++) {
				matrix[messageWord][patternWord] = this.compareWords(message[messageWord], pattern[patternWord])
			}
		}

		const max = message.length + pattern.length
		let sum = 0

		for (let patternWord = 0; patternWord < pattern.length; patternWord++) {
			let patternMax = 0
			for (let messageWord = 0; messageWord < message.length; messageWord++) {
				if (matrix[messageWord][patternWord] > patternMax) {
					patternMax = matrix[messageWord][patternWord]
				}
			}
			sum += patternMax
		}

		for (let messageWord = 0; messageWord < message.length; messageWord++) {
			let messageMax = 0
			for (let patternWord = 0; patternWord < pattern.length; patternWord++) {
				if (matrix[messageWord][patternWord] > messageMax) {
					messageMax = matrix[messageWord][patternWord]
				}
			}
			sum += messageMax
		}

		return sum / max
	}

	static compareWords(word1, word2) {
		let sum = 0.0
		let minLength = Math.min(word1.length, word2.length)
		let maxLength = Math.max(word1.length, word2.length)

		for (let i = 0; i < minLength; i++) {
			if (word1.charAt(i) == word2.charAt(i)) {
				sum++
			}
		}

		return sum / maxLength
	}

	static createMatrix(x, y) {
		let matrix = new Array(x)
		for (let i = 0; i < y; i++) {
			matrix[i] = new Array(y)
		}

		return matrix
	}

	static trimArray(inputArray) {
		const tmp = [];
		for (let i = 0; i < inputArray.length; i++) {
			if (inputArray[i] !== null && inputArray[i] !== "") {
				tmp.push(inputArray[i]);
			}
		}
		return tmp;
	}
}

class MessagePreparer {
	static load(){
		this.synonimousProvider = SynonimousProvider
		this.synonimousProvider.load()
	}

	static processMessageBeforeComparation(input) {
		let result = input
		result = this.toLowerCase(result)
		result = this.replaceLatin(result)
		result = this.replaceLetters(result)
		result = this.removeBackets(result)
		result = this.deleteBadSymbols(result)
		result = this.replaceSynonimous(result)

		return result
	}

	static processWordBeforeComparation(input) {
		let result = input
		result = this.toLowerCase(result)
		result = this.replaceLatin(result)
		result = this.replaceLetters(result)
		result = this.removeBackets(result)
		result = this.deleteBadSymbols(result)

		return result
	}

	static toLowerCase(input) {
		return input.toLowerCase()
	}

	static replaceLatin(input) {
		let result = input // (\_/)
		result = result.replace('a', 'а');
		result = result.replace('b', 'б');
		result = result.replace('c', 'с');
		result = result.replace('d', 'д');
		result = result.replace('e', 'е');
		result = result.replace('f', 'ф');
		result = result.replace('g', 'г');
		result = result.replace('h', 'х');
		result = result.replace('i', 'и');
		result = result.replace('j', 'й');
		result = result.replace('k', 'к');
		result = result.replace('l', 'л');
		result = result.replace('m', 'м');
		result = result.replace('n', 'н');
		result = result.replace('o', 'о');
		result = result.replace('p', 'п');
		result = result.replace('q', 'к');
		result = result.replace('r', 'р');
		result = result.replace('s', 'с');
		result = result.replace('t', 'т');
		result = result.replace('u', 'у');
		result = result.replace('v', 'в');
		result = result.replace('w', 'в');
		result = result.replace('x', 'х');
		result = result.replace('y', 'у');
		result = result.replace('z', 'з');

		return result
	}

	static replaceLetters(input) {
		let result = input
		result = result.replace('о', 'а');
		result = result.replace('й', 'и');
		result = result.replace('е', 'и');
		result = result.replace('ё', 'и');
		result = result.replace('ы', 'и');
		result = result.replace('і', 'и');
		result = result.replace('ї', 'и');
		result = result.replace('э', 'и');
		result = result.replace('т', 'д');
		result = result.replace('з', 'с');
		result = result.replace('ц', 'с');
		result = result.replace('ф', 'в');
		result = result.replace('щ', 'ш');
		result = result.replace('б', 'п');
		result = result.replace('г', 'х');
		result = result.replace('ъ', 'ь');

		return result
	}

	static removeBackets(input) {
		let maxDepth = 0; // ...why
		let currentDepth = 0;
		let resultString = '';

		for (let i = 0; i < input.length; i++) {
			const character = input.charAt(i);

			if (character === '[') {
				currentDepth++;
			}

			if (currentDepth === 0) {
				resultString += character;
			}

			if (character === ']') {
				currentDepth--;
			}

			if (currentDepth > maxDepth) {
				maxDepth = currentDepth;
			}
		}

		if (maxDepth > 0) {
			let result = '';
			try {
				result = resultString.substring(2);
			} catch (e) {}
			return result;
		}

		return resultString;
	}

	static deleteBadSymbols(input) {
		const allowed = "ёйцукенгшщзхъфывапролджэячсмитьбю123456789"
		let bakeResult = ""

		for (let letter of input) {
			bakeResult += allowed.includes(letter) ? letter : " "
		}

		let result = " " + bakeResult + " "

		result = result.replaceAll(" +", " ")

		return result
	}

	static replaceSynonimous(input){
		let result = input
		result = this.synonimousProvider.getAllMain(result)

		return result
	}
}

class SynonimousProvider {
	synonimous = []
	scopes = []
	mainPhrases = new Map();

	static load(){
		const file = fs.readFileSync("./data/synonimous.txt").toString()
		const lines = file.split("\n")
		this.scopes = []
		this.synonimous = []

		for(let line of lines){
			let scope = new Scope(line)
			this.addScope(scope)
		}
	}

	static getAllMain(text){
		if(!this.mainPhrases){
			this.mainPhrases = new Map()
		}

		if(this.mainPhrases.has(text)){
			return this.mainPhrases.get(text)
		}

		const inStr = text;

		for(let scope of this.scopes){
			text = scope.replaceSynsByMain(text)
		}

		this.mainPhrases.set(inStr, text)

		return text
	}

	static addScope(scope){
		for(let scopeWord of this.scopes){
			if(scopeWord.isSimillar(scope)){
				scopeWord.complete(scope)
				return;
			}
		}
		this.scopes.push(scope)
	}
}

class Scope {
	constructor(scope){
		let splitted = scope.split("\\")
		this.words = splitted.map(e => MessagePreparer.processWordBeforeComparation(e))
	}

	isSimillar(scope){
		for(let word of this.words){
			for(let scopeWord of scope.words){
				return word === scopeWord
			}
		}
	}

	complete(scope){
		for(let word of scope.words){
			if(!this.words.includes(word)){
				this.words.push(word)
			}
		}
	}

	replaceSynsByMain(text){
		const mainSyn = this.getMainSyn()
		for(let word of this.words){
			text = text.replace(word, mainSyn)
		}
		return text
	}

	getMainSyn(){
		return this.words[0]
	}
}

module.exports = AnswerDatabase