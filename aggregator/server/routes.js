const knexDB = require('./knex')

const setUpRoutes = (app) => {
    // POST method route
    app.post('/register', (req, res) => {
        res.send('POST request to the homepage')
        knexDB('users').insert({username: req.body.name, email: req.body.email, password: req.body.password})
    })
}

exports.setUpRoutes = setUpRoutes;