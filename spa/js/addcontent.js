
/* addcontent.js */

import { createToken, customiseNavbar, secureGet, securePost, loadPage, showMessage, file2DataURI } from '../util.js'

export async function setup(node) {
	console.log('addcontent: setup')
	try {
		console.log(node)
		document.querySelector('body p').innerText = 'Add Content'
		customiseNavbar(['home', 'foo', 'logout']) // navbar if logged in
		const token = localStorage.getItem('authorization')
		if(token === null) customiseNavbar(['home', 'register', 'login']) //navbar if logged out
		console.log("checkpoint")
		// add content to the page
		node.querySelector('form').addEventListener('submit', await addContent)
	} catch(err) {
		console.error(err)
	}
}





async function addContent(node,token) {
	event.preventDefault()
	console.log('form submitted')
	const formData = await new FormData(event.target)
	const data = await Object.fromEntries(formData.entries())	
	let body = {
		"data": [{
			"type": "contents",
			"attributes": {
				"title": data.title,
				"content": data.content
			}
		}]
	}
	console.log(body)
	if(data.image.size) body.data[0].attributes.image = await file2DataURI(data.image)
	console.log(file2DataURI(data.image))
	const response = await securePost('/api/contents', localStorage.getItem('authorization'), body)
	if(response.status === 201) {
		showMessage(`The content as been added successfuly.`)
		await loadPage('home')
	} else {
		showMessage(response.json.errors[0].detail)
		}
	
}
