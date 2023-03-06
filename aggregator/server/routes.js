const knexDB = require('./knex')

const setUpRoutes = (app) => {
    // POST method route
    app.post('/register', async (req, res) => {
        val = await knexDB('users').insert({username: req.body.name, email: req.body.email, password: req.body.password})
        res.send('POST request to the homepage')
    })
    // GET method route
    // app.get('/login', (req, res) => {
    //     knexDB.select('username').from('users')
    //     knexDB.select('password').from('users')
    //     res.send('GET request to the homepage')
    // })
}

exports.setUpRoutes = setUpRoutes;