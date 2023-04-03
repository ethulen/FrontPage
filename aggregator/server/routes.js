const knexDB = require("./knex");
const bcrypt = require("bcrypt");
const express = require('express')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sessions = require('express-session');
const saltRounds = 10;
const app = express();

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
	secret: "iunfvuieanfcaoirghaiwefnaeriupth5657563w43",
	saveUninitialized: true,
	cookie: { maxAge: oneDay },
	resave: false
}));

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

// a variable to save a session
var session;

const setUpRoutes = (app) => {
	app.get('/', (req, res) => {
		session = req.session;
		if (session.userid) {
			res.send("Welcome User <a href=\'/logout'>click to logout</a>");
		} else
			res.sendFile('views/index.html', { root: __dirname })
	});

	app.use(bodyParser.json());

	app.post("/", async (req, res) => {
		const { domains } = req.body;
		try {
			const response = await axios.get("https://newsapi.org/v2/top-headlines", {
				params: {
					apiKey: 'e188a3e6d6c64590be570b46271bd205',
					sources: domains.join(","),
				},
			});
			res.json(response.data);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Internal server error" });
		}
	});

	// POST method route
	app.post("/register", async (req, res) => {
		//TODO: salt in addition to hash
		console.log(req.body)
		password = await bcrypt.hash(req.body.password, saltRounds);
		val = await knexDB("users").insert({
			username: req.body.name,
			email: req.body.email,
			password: password,
		});
		res.send("POST request to the homepage");
	});
	//POST sources route
	app.post("/sourceSelect", async (req, res) => {
		console.log(req.body.sources)
		val = await knexDB("users").insert({
			sources: req.body.sources
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
			if (bcrypt.compareSync(req.body.password, existing_user.password)) {
				session = req.session;
				session.userid = req.body.username;
				console.log(req.session)
				//send hashed unique identifier
				//TODO: create Javascript web token
				res.send("Success");
			}
			else {
				res.send("Invalid username/password");
			}
		}
	})
	app.get('/logout', (req, res) => {
		req.session.destroy();
		req.sources = null;
		cookies.remove('http://localhost:3000')
		res.redirect('/');
	});
};

exports.setUpRoutes = setUpRoutes;
