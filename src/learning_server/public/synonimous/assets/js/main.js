let mainSynonimous = []
let lastWord = ""

async function onLoad() {
	await getAllSynonimous()

	for(let synonimous of mainSynonimous) {
		createNewElement(synonimous)
	}
}

function createNewElement(text) {
	const option = document.createElement("option");
	option.value = text
	option.text = text

	document.getElementById("synonimous").add(option, null)
}

document.getElementById('learnButton').addEventListener("click", async function() {
	let data = document.getElementById("synonimousText").value
	if (!data) return;

	data = data.toLowerCase()

	const synonimous = document.getElementById("synonimous")

	if (synonimous.value == "_addNew" && !mainSynonimous.includes(data)) {
		mainSynonimous.push(data)
		createNewElement(data)
	}

	const response = await fetch("/api/synonimous", {
		method: "POST",
		body: JSON.stringify({
			word: data,
			main: synonimous.value
		}),
		headers: {
			"Content-Type": "application/json"
		}
	})

	const result = await response.json()
	if (result.ok === true) {
		document.getElementById("synonimousText").value = ""
		document.getElementById("word").innerText = "Success!"
	} else {
		document.getElementById("word").innerText = "Failed!"
	}
})

document.getElementById('goto').addEventListener("click", function() {
	window.location.href = window.location.href.replace("/synonimous", "")
})

async function getAllSynonimous() {
	const response = await fetch("/api/getAllSynonimous")
	const result = await response.text()

	mainSynonimous = result.split("\n").map(synonimous => synonimous.split("\\")[0])
}

function random(min, max) {
	return Math.round(Math.random() * (max - min)) + min
}