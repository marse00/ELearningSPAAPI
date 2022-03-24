import { db } from './db.js'


async function getUserID(username) {
	try {
		let sql = `SELECT id FROM accounts WHERE user="${username}";`
		let records = await db.query(sql)
		return records[0]['id']
	}
	catch(err) {
		console.log("contents.js getUserID Error: "+err.message)
	}
	
}
async function getUserName(id) {
	try {
		let sql = `SELECT user FROM accounts WHERE id="${id}";`
		let records = await db.query(sql)
		return records[0]['user']
	}
	catch(err) {
		console.log("contents.js getUserName Error: "+err.message)
	}
}
export async function getContents(credentials) {
	let id = await getUserID(credentials.user)
	let sql = `SELECT contents.id, contents.title, accounts.user, contents.submitDate, IFNULL(accesses.accessed,0) as accessed, answers.answer, contents.answer as correct_answer
	FROM contents
	LEFT JOIN accesses ON contents.id = accesses.contentID
	AND accesses.accountID ="${id}" LEFT JOIN answers ON contents.id = answers.contentID AND answers.accountID ="${id}" LEFT JOIN accounts ON contents.author = accounts.id ORDER BY submitDate DESC;`
	let records = await db.query(sql)
	return records
}

export async function getContentByID(ID) {
	try{
		
		let sql = `SELECT contents.id, title, accounts.user, author, submitDate, content, image, question, answer1, answer2, answer3, answer4
		FROM contents
		LEFT JOIN accounts ON contents.author = accounts.id
		WHERE contents.id="${ID}";`
		let records = await db.query(sql)
		return records[0]
	}
	catch(err){
		console.log("contents.js getContentByID Error: "+err.message)
	}
	return null
}

export async function setAccessed(credentials, contentID) {
	try{
		let id = await getUserID(credentials.user)
		let sql = `INSERT INTO accesses(contentID, accountID, accessed) VALUES("${contentID}","${id}","1");`
		await db.query(sql)
	}
	catch(err){
		console.log("contents.js setAccessed Error: "+err.message)
	}
	
	return true
}

export async function addContent(content) {
	console.log(content)
	let id = await getUserID(content.author)
	const sql = `INSERT INTO contents(title, author, content, image) VALUES("${content[0].attributes.title}", "${id}", "${content[0].attributes.content}","${content[0].attributes.image}");`
	await db.query(sql)
	return true
}

export async function addQuestion(question, id) {
	try{
		console.log(question.attributes)
		let sql = `UPDATE contents
		SET question = "${question.attributes.question}", answer1 = "${question.attributes.answer1}", answer2 = "${question.attributes.answer2}", answer3 = "${question.attributes.answer3}", 
		answer4 = "${question.attributes.answer4}", answer = "${question.attributes.correct}"
		WHERE id = "${id}";`
		await db.query(sql)
		return true
	}
	catch(err){
		console.log("contents.js setAccessed Error: "+err.message)
	}
}

export async function getQuestionByID(ID) {
	try{
		let sql = `SELECT question, answer1, answer2, answer3, answer4, questionImage
		FROM contents
		WHERE id="${ID}";`
		let records = await db.query(sql)
		return records[0]
	}
	catch(err){
		console.log("contents.js getQuestionByID Error: "+err.message)
	}
}


export async function addAnswer(content,contentID) {
	console.log(content)
	let id = await getUserID(content.author)
	const sql = `INSERT INTO answers(contentID, accountID, answer) VALUES("${contentID}", "${id}", "${content[0].attributes.answer}");`
	await db.query(sql)
	return true
}
