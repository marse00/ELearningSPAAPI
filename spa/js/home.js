
/* home.js */

import { createToken, customiseNavbar, secureGet, loadPage, showMessage } from '../util.js'

export async function setup(node) {
	console.log('HOME: setup')
	try {
		console.log(node)
		document.querySelector('body p').innerText = 'Home'
		customiseNavbar(['home', 'foo', 'addcontent', 'logout']) // navbar if logged in
		const token = localStorage.getItem('authorization')
		if(token === null) customiseNavbar(['home', 'register', 'login']) //navbar if logged out
		// add content to the page
		await addContents(node,token)
	} catch(err) {
		console.error(err)
	}
}


async function addContents(node,token) {

	const access = new Map()
	access.set(0,"Not Accessed")
	access.set(1,"Accessed")

	console.log(token)
	let response = await secureGet("/api/contents",token)
	const contents = await response.json
	const template = document.querySelector('template#contentSummary')
	for (let i = 0; i < contents.data.contents.length; i++) {
		console.log(contents.data.contents[i].title)
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = contents.data.contents[i].title
		fragment.querySelector('a#contentlink').href = `/contents#${contents.data.contents[i].id}`
		fragment.querySelector('p#author').innerText += contents.data.contents[i].user
		let dateSQL = new Date(contents.data.contents[i].submitDate)
		fragment.querySelector('p#date').innerText += dateSQL.toDateString()
		fragment.querySelector('p#accessed').innerText += access.get(contents.data.contents[i].accessed)
		fragment.querySelector('a#questionlink').href += `/contents#${contents.data.contents[i].id}#question`


		node.appendChild(fragment)
	}

}


// this example loads the data from a JSON file stored in the uploads directory
async function addContent(node) {
	const response = await fetch('/uploads/quotes.json')
	const quotes = await response.json()
	const template = document.querySelector('template#quote')
	for(const quote of quotes.data) {
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = quote.author
		fragment.querySelector('p').innerText = quote.quote
		node.appendChild(fragment)
	}
}
