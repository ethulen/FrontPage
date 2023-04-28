const jwt = require("jsonwebtoken");
const { promisify } = require("util")
const knexDB = require("./knex");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const crypto = require("crypto")

const randomBytes = promisify(crypto.randomBytes)
const hash = promisify(bcrypt.hash)

var g = require('ger')
var esm = new g.MemESM()
var ger = new g.GER(esm);

// middleware to test if authenticated
function isAuthenticated(req, res, next) {
	console.log(req.cookies);
	if (req.session.user) {
		console.log("User Authenticated " + req.session.user);
		next();
	} else {
		console.log("Unauthenticated User!");
		next("route");
	}
}

const setUpRoutes = (app) => {
	//GET method route for sources
	app.get("/user/:id", async (req, res) => {
		var sources = await knexDB("users")
			.select("sources")
			.where("id", req.params.id);
		console.log(sources);
		req.session.regenerate(async (err) => {
			if (err) {
				console.log("Error!");
				console.log(err);
				next(err);
			}
		});
		res.status(200).json(sources[0]);
	});
	app.get("/user/:id/recommended", async (req, res) => {
		ger.initialize_namespace('news')
			.then(async function () {
				var recommendations = await knexDB("recommendations")
					.where("person", req.params.id);
				ger.events(recommendations);
			})
			.then(req.session.regenerate(async (err) => {
				if (err) {
					console.log("Error!");
					console.log(err);
					next(err);
				}
			}))
			.then(function () {
				// What things might a user like?
				return ger.recommendations_for_person('news', req.body.name, { actions: { clicks: 1 } })
			})
			.then(async function (recommendations) {
				console.log("\nRecommendations")
				console.log(JSON.stringify(recommendations, null, 2))
				console.log(recommendations.recommendations[0].people)
				if (recommendations.recommendations[0].people !== undefined) {
					let sources;
					console.log("People: " + recommendations.recommendations[0].people);
					let recommended = [];
					for (let i = 0; i < recommendations.recommendations[0].people.length; i++) {
						sources = await knexDB("users")
							.select("sources")
							.where("id", recommendations.recommendations[0].people[i]);
						console.log("Recommended sources: " + sources);
						recommended.push(sources)
					}
					if (recommended[1] === undefined) {
						res.status(200).json(recommended[0]);
					}
					else {
						res.status(200).json(recommended[1]);
					}
				}
			})
	});

	app.post("/user/:id/clicks", async (req, res) => {
		try {
			const val = await knexDB("recommendations").insert({
				namespace: 'news',
				person: req.body.name,
				action: 'clicks',
				clicked_articles: req.body.article,
				expires_at: '2024-06-06'
			});
		}
		catch (error) {
			console.log(error);
			res.status(500).json({ message: 'Internal server error' });
		}
	});
	// POST method route
	app.post("/register", async (req, res) => {
		try {
			console.log(req.body.sourceList);
			const bytes = await randomBytes(20)
			const salt = bytes.toString('hex')
			const password = await hash(salt + req.body.password, saltRounds)
			console.log(password)
			const val = await knexDB("users").insert({
				username: req.body.name,
				email: req.body.email,
				password: password,
				salt: salt,
			});
			const user = await knexDB("users")
				.select("id")
				.where("username", req.body.name)
				.first();
			console.log("userid " + user.id);
			req.session.user = user.id;
			const token = jwt.sign({ userId: req.session.user }, "secretKey", {
				expiresIn: "1h",
			});
			req.session.save(function (err) {
				if (err) {
					console.log("Error2");
					console.log(err);
					return next(err);
				}
				console.log("saved");
				res.status(200).json({ token: token });
			});
		} catch (error) {
			if (error.code === 'ER_DUP_ENTRY') {
				res.status(409).json({ message: 'User already exists' });
			} else {
				console.log(error);
				res.status(500).json({ message: 'Internal server error' });
			}
		}
	});


	//POST sources route
	app.post("/sourceSelect", isAuthenticated, async (req, res) => {
		console.log(req.body.sourceList);
		console.log(req.cookies);
		console.log("userid " + req.session.user);
		val = await knexDB("users")
			.where("id", req.session.user)
			.update({
				sources: JSON.stringify(req.body.sourceList),
			});
		res.send("POST request to the homepage");
	});
	// POST method route
	app.post("/login", async (req, res) => {
		var users = await knexDB
			.select()
			.from("users")
			.where("username", req.body.name)
			.limit(1);
		if (users.length === 0) {
			res.send("Invalid username/password");
		} else {
			// user already exists with that email
			var existing_user = users[0];
			//append salt to req.body.password
			password = existing_user.salt + req.body.password
			if (await bcrypt.compare(password, existing_user.password)) {
				console.log("session: " + req.session);
				req.session.regenerate(async (err) => {
					if (err) {
						console.log("Error!");
						console.log(err);
						next(err);
					}
				});
				console.log("body: " + req.body)
				var user = await knexDB("users")
					.select("id")
					.where("username", req.body.name)
					.first();
				console.log("userid " + user.id);
				req.session.user = user.id;
				const token = jwt.sign({ userId: req.session.user }, "secretKey", {
					expiresIn: "1h",
				});
				req.session.save(function (err) {
					if (err) {
						console.log("Error2");
						console.log(err);
						return next(err);
					}
					console.log("saved");
					res.status(200).json({ token: token });
				});
			}
			else {
				res.status(403).json("Invalid username/password");
			}
		}
	});

	app.get("/logout", (req, res) => {
		req.session.destroy();
		res.redirect("/");
	});
};

exports.setUpRoutes = setUpRoutes;
