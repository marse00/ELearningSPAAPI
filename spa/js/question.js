
/* addcontent.js */

import { createToken, customiseNavbar, secureGet, securePost, loadPage, showMessage, file2DataURI } from '../util.js'

export async function setup(node) {
	console.log('addcontent: setup')
	console.log("node: "+node)
	try {
		console.log(node)
		document.querySelector('body p').innerText = 'Edit Question'
		customiseNavbar(['home', 'foo', 'logout']) // navbar if logged in
		const token = localStorage.getItem('authorization')
		if(token === null) customiseNavbar(['home', 'register', 'login']) //navbar if logged out
		console.log("checkpoint")
		// add content to the page
		node.querySelector('form').addEventListener('submit', await addQuestion)
	} catch(err) {
		console.error(err)
	}
}





async function addQuestion(node,token) {
	event.preventDefault()
	console.log('form submitted')
	const formData = await new FormData(event.target)
	const data = await Object.fromEntries(formData.entries())	
	let body = {
		"data": [{
			"type": "contents",
			"attributes": {
				"question": data.question,
				"answer1": data.answer1,
				"answer2": data.answer2,
				"answer3": data.answer3,
				"answer4": data.answer4,
				"correct": data.correct

			}
		}]
	}
	console.log(body)
	if(data.image.size) body.data[0].attributes.image = await file2DataURI(data.image)
	console.log(file2DataURI(data.image))

	let id = await getIDFromPath()
	const response = await securePost(`/api/contents/${id}/question`, localStorage.getItem('authorization'), body)
	if(response.status === 201) {
		showMessage(`The content as been added successfuly.`)
		await loadPage('home')
	} else {
		showMessage(response.json.errors[0].detail)
		}
	
}

async function getIDFromPath() {
	let path = await window.location.pathname.replace('/', '')
	path = path + window.location.hash
	path = await path.split('#')
	let id = path.at(-2)
	return id
}