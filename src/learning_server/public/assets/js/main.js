document.getElementById('learnButton').addEventListener("click", async function() {
	const question = document.getElementById("question").value
	const answer = document.getElementById("answer").value
	if (!question || !answer) return;

	const response = await fetch("/api/learn", {
		method: "POST",
		body: JSON.stringify({
			word: question,
			data: answer,
			unknown: false
		}),
		headers: {
			"Content-Type": "application/json"
		}
	})

	const result = await response.json()
	if (result.ok === true) {
		document.getElementById("word").innerText = "Success!"
		document.getElementById("question").value = ""
		document.getElementById("answer").value = ""
	}
})

document.getElementById('goto').addEventListener("click", function() {
	window.location.href = window.location.href + "unknown"
})

document.getElementById('gotoSyn').addEventListener("click", function() {
	window.location.href = window.location.href + "synonimous"
})