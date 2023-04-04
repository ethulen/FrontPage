const knexDB = require("./knex");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// middleware to test if authenticated
function isAuthenticated (req, res, next) {
	console.log(req.cookies)
  if (req.session.user){
		console.log("User Authenticated " + req.session.user)
		next()
	}
  else{
		console.log("Unauthenticated User!")
		next('route')
	}
}

const setUpRoutes = (app) => {
	app.get('/', (req, res) => {
		session = req.session;
		if (session.userid) {
			res.send("Welcome User <a href=\'/logout'>click to logout</a>");
		} else
			res.sendFile('views/index.html', { root: __dirname })
	});

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
		console.log(req.body.sourceList)
		password = await bcrypt.hash(req.body.password, saltRounds);
		val = await knexDB("users").insert({
			name: req.body.name,
			email: req.body.email,
			password: password,
		});
		req.session.regenerate(async (err) => {
			if (err){
				console.log("Error!")
				console.log(err)
				next(err)
			}

			var user = await knexDB("users").select('id').where('email', req.body.email).first();
			console.log("userid " + user.id)
			req.session.user = user.id

			req.session.save(function (err) {
				if (err) {
					console.log("Error2")
					console.log(err)
					return next(err)
				}
				console.log("saved");
				res.status(200).json("Login Saved!")
			})
		});

	});
	//POST sources route
	app.post("/sourceSelect", isAuthenticated, async (req, res) => {
		console.log(req.body.sourceList)
		console.log(req.cookies)
		console.log("userid " + req.session.user)
		val = await knexDB("users").where('id', req.session.user).update({
			sources: JSON.stringify(req.body.sourceList)
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
