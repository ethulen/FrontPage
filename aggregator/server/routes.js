const knexDB = require("./knex");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const setUpRoutes = (app) => {
	// POST method route
	app.post("/register", async (req, res) => {
		password = bcrypt.hash(req.body.password, saltRounds);
		val = await knexDB("users").insert({
			username: req.body.name,
			email: req.body.email,
			password: password,
		});
		res.send("POST request to the homepage");
	});
	// GET method route
	app.get("/login", async (req, res) => {
		var users = knex
			.select()
			.from("users")
			.where("username", res.body.name)
			.limit(1);
		if (users.length === 0) {
			// no user with matching email found, so create new account
		} else {
			// user already exists with that email
			var existing_user = users[0];
		}
		var passwords = knex
			.select()
			.from("users")
			.where("password", res.body.password)
			.limit(1);
		if (users.length === 0) {
			// no user with matching email found, so create new account
		} else {
			// user already exists with that email
			var existing_user = users[0];
		}
		res.send("GET request to the homepage");
	});
};

exports.setUpRoutes = setUpRoutes;
