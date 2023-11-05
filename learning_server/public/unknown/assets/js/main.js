let unknownWords = []
let lastWord = ""

async function onLoad() {
	await updateUnknownWords()
	await setWord(getNewUnknownWord())
}

document.getElementById('learnButton').addEventListener("click", async function() {
	const data = document.getElementById("learn").value
	if (!data || !lastWord) return;

	unknownWords = unknownWords.slice(1)

	const response = await fetch("/api/learn", {
		method: "POST",
		body: JSON.stringify({
			word: lastWord,
			data: data,
			unknown: true
		}),
		headers: {
			"Content-Type": "application/json"
		}
	})

	const result = await response.json()
	if (result.ok === true) {
		document.getElementById("learn").value = ""
		await setWord(getNewUnknownWord())
	}
})

document.getElementById('delete').addEventListener("click", async function() {
	unknownWords = unknownWords.slice(1)

	const response = await fetch("/api/delete", {
		method: "POST",
		body: JSON.stringify({
			word: lastWord
		}),
		headers: {
			"Content-Type": "application/json"
		}
	})

	const result = await response.json()
	if (result.ok === true) {
		document.getElementById("learn").value = ""
		await setWord(getNewUnknownWord())
	}
})

document.getElementById('reload').addEventListener("click", onLoad)

document.getElementById('goto').addEventListener("click", function() {
	window.location.href = window.location.href.replace("/unknown", "")
})

async function setWord(word) {
	lastWord = word
	document.getElementById("word").innerText = lastWord == undefined ? "No more words in unknown.json!" : lastWord
}

function getNewUnknownWord() {
	return unknownWords[0]
}

async function updateUnknownWords() {
	const response = await fetch("/api/getUnknownWords")
	const result = await response.json()

	unknownWords = result

	return result
}

function random(min, max) {
	return Math.round(Math.random() * (max - min)) + min
}