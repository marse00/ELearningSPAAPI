
/* routes.js */

import { Router } from 'https://deno.land/x/oak@v6.5.1/mod.ts'

import { extractCredentials, saveFile } from './modules/util.js'
import { login, register } from './modules/accounts.js'

const router = new Router()

// the routes defined here
router.get('/', async context => {
	console.log('GET /')
	const data = await Deno.readTextFile('spa/index.html')
	context.response.body = data
})

router.get('/api/accounts', async context => {
	console.log('GET /api/accounts')
	const token = context.request.headers.get('Authorization')
	console.log(`auth: ${token}`)
	try {
		const credentials = extractCredentials(token)
		console.log(credentials)
		const username = await login(credentials)
		console.log(`username: ${username}`)
		context.response.body = JSON.stringify(
			{
				data: { username }
			}, null, 2)
	} catch(err) {
		context.response.status = 401
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: '401 Unauthorized.',
						detail: err.message
					}
				]
			}
		, null, 2)
	}
})

router.post('/api/accounts', async context => {
	console.log('POST /api/accounts')
	const body  = await context.request.body()
	const data = await body.value
	console.log(data)
	await register(data)
	context.response.status = 201
	context.response.body = JSON.stringify({ status: 'success', msg: 'account created' })
})

router.post('/api/files', async context => {
	console.log('POST /api/files')
	try {
		const token = context.request.headers.get('Authorization')
		console.log(`auth: ${token}`)
		const body  = await context.request.body()
		const data = await body.value
		console.log(data)
		saveFile(data.base64, data.user)
		context.response.status = 201
		context.response.body = JSON.stringify(
			{
				data: {
					message: 'file uploaded'
				}
			}
		)
	} catch(err) {
		context.response.status = 400
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: 'a problem occurred',
						detail: err.message
					}
				]
			}
		)
	}
})

router.get('/api/contents', async context => {
	//anyone logged in can access this
	console.log('GET /api/contents')
	const token = context.request.headers.get('')
})

router.post('/api/contents', async context => {
	//Accounts with the teacher role can access this
	console.log('POST /api/contents')
})

router.get('/api/contents/{:id}', async context => {
	//anyone logged in can access this
	console.log('GET /api/contents/{:id}')
})

router.get('/api/contents/{:id}/question', async context => {
	//anyone logged in can access this
	console.log('GET /api/contents/{:id}/question')
})

router.post('/api/contents/{:id}/question', async context => {
	//The teacher that owns the content can access this
	console.log('POST /api/contents/{:id}/question')
})

router.put('/api/contents/{:id}/question', async context => {
	//The teacher that owns the content can access this
	console.log('PUT /api/contents/{:id}/question')
})

router.get('/api/contents/{:id}/answers/{:userid}', async context => {
	//only the student author of the question can access or teachers
	console.log('GET /api/contents/{:id}/answers/{:userid}')
})

router.post('/api/contents/{:id}/answers', async context => {
	//only students can access this
	console.log('POST /api/contents/{:id}/answers')
})

router.get("/(.*)", async context => {      
// 	const data = await Deno.readTextFile('static/404.html')
// 	context.response.body = data
	const data = await Deno.readTextFile('spa/index.html')
	context.response.body = data
})

export default router

