const { Router } = require('express')
// const { each } = require('jquery')
const router = Router()
const fetch = require('node-fetch')
const url = 'https://kitaeza-api.herokuapp.com/api/'
const hideHeader = 'hide'
var isLoggedIn = false
var email
var token

const defaultHeaders = {
    'Content-Type': 'application/json'
}

function authHeader(t) {
    return authorizedHeaders = {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + t
    }
}

async function sendRequest(method = 'GET', url = '', body = null, headers = defaultHeaders) {
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: headers,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(body) // body data type must match "Content-Type" header
    })
    
    return await response.json()
    // if (response.ok) { // parses JSON response into native JavaScript objects
    // }
    // Реализовать обработку ошибок
}

async function sendGetRequest(url = '', headers) {
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: headers
    })

    if (response.ok) {
        return await response.json() // parses JSON response into native JavaScript objects
    }
    // Реализовать обработку ошибок
}

router.get('/admin-panel', async (req, res) => {
    var product = await sendGetRequest(url + 'products/')
    res.render('admin-panel', {
        title: 'Панель администрирования',
        hideHeader,
        product: product,
        email
    })
})

router.get('/', async (req, res) => {
    var product = await sendGetRequest(url + 'products/')
    res.render('404', {
        title: 'Панель администрирования',
        hideHeader,
        isLoggedIn: false
    })
})

router.get('/admin-panel/add-category', async (req, res) => {
    var category = await sendGetRequest(url + 'categories/')
    res.render('add-category', {
        title: 'Добавить категорию',
        hideHeader,
        category: category,
        email
    })
})

router.get('/admin-panel/edit-category', async (req, res) => {
    var category = await sendGetRequest(url + 'categories/')
    res.render('edit-category', {
        title: 'Изменить категорию',
        hideHeader,
        category,
        email
    })
})

router.get('/admin-panel/add-user', async (req, res) => {
    var user = await sendGetRequest(url + 'users/')
    res.render('add-user', {
        title: 'Добавить пользователя',
        hideHeader,
        user: user,
        email
    })
})

router.get('/admin-panel/edit-user', async (req, res) => {
    var user = await sendGetRequest(url + 'users/')
    res.render('edit-user', {
        title: 'Изменить пользователя',
        hideHeader,
        user: user,
        email
    })
})

router.get('/admin-panel/add-product', async (req, res) => {
    var product = await sendGetRequest(url + 'products/')
    var category = await sendGetRequest(url + 'categories/')
    res.render('add-product', {
        title: 'Добавить товар',
        hideHeader,
        product: product,
        category: category,
        email
    })
})

router.get('/admin-panel/edit-product', async (req, res) => {
    var product = await sendGetRequest(url + 'products/')
    res.render('edit-product', {
        title: 'Изменить товар',
        hideHeader,
        product: product,
        email
    })
})

router.post('/authorization', async (req, res) => {
    try {
        await sendRequest('POST', url + 'users/login', { 
            user: {
                email: req.body.email,
                password: req.body.password
            }
         }).then(data => {
            token = data.user.token
            email = data.user.email
            isLoggedIn = true
            res.redirect('/admin-panel')
        })
    }
    catch {
        res.redirect('/registration')
    }
})

router.post('/add-product', async (req, res) => {
    sendRequest('POST', url + 'products/', {
        title: req.body.title,
        subtitle: req.body.subtitle,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        amount: req.body.amount,
        imageurl: req.body.imageurl
    }, authHeader(token)).then(data => {
        console.log(data)
        res.redirect('/admin-panel/add-product')
    })
})

router.post('/add-category', async (req, res) => {
    sendRequest('POST', url + 'categories/', {
        title: req.body.title,
        description: req.body.description
    }, authHeader(token)).then(data => {
        console.log(data)
        res.redirect('/admin-panel/add-category')
    })
})

module.exports = router