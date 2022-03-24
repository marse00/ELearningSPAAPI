
/* contents.js */

import { createToken, customiseNavbar, secureGet, loadPage, showMessage } from '../util.js'

export async function setup(node) {
	console.log('Contents: setup')
	try {
		document.querySelector('body p').innerText = 'Content'
		customiseNavbar(['home', 'foo', 'logout']) // navbar if logged in
		const token = localStorage.getItem('authorization')
		if(token === null) customiseNavbar(['home', 'register', 'login']) //navbar if logged out
		console.log("checkpoint")
		// load content on the page
		await loadContentDetails(node,token)
	} catch(err) {
		console.error(err)
	}
}


async function loadContentDetails(node,token) {

	const access = new Map()

	console.log(token)
	let pathname = await window.location.hash.split(`#`)
	console.log(pathname)
	const id = await pathname.at(1)
	console.log(id)
	let response = await secureGet(`/api/contents/${id}`,token)
	const contents = await response.json
	console.log(contents)

	const template = await document.querySelector('template#contentDetails')
	//title, author, submitDate, content, image, question, answer1, answer2, answer3, answer4
	const fragment = template.content.cloneNode(true)
	fragment.querySelector('h2').innerText = contents.data.content.title
	fragment.querySelector('p#content').innerText += contents.data.content.content
	fragment.querySelector('p#author').innerText += contents.data.content.user
	let dateSQL = new Date(contents.data.content.submitDate)
	fragment.querySelector('p#date').innerText += dateSQL.toDateString()
	fragment.querySelector('img#contentImage').src = contents.data.content.image

	if(!contents.data.content.image || contents.data.content.image == "undefined") fragment.querySelector('img#contentImage').style.display = "none"

	//Hide if null
	if(!contents.data.content.question) {
		fragment.querySelector('p#question').style.display = "none"
		fragment.querySelector('p#answer1').style.display = "none"
		fragment.querySelector('p#answer2').style.display = "none"
		fragment.querySelector('p#answer3').style.display = "none"
		fragment.querySelector('p#answer4').style.display = "none"
		
	}
	if(!contents.data.content.questionImage || contents.data.content.questionImage == "undefined") fragment.querySelector('img#questionImage').style.display = "none"
	fragment.querySelector('p#question').innerText += contents.data.content.question
	fragment.querySelector('p#answer1').innerText += contents.data.content.answer1
	fragment.querySelector('p#answer2').innerText += contents.data.content.answer2
	fragment.querySelector('p#answer3').innerText += contents.data.content.answer3
	fragment.querySelector('p#answer4').innerText += contents.data.content.answer4
	fragment.querySelector('img#questionImage').src = contents.data.content.questionImage
	node.appendChild(fragment)
	

}