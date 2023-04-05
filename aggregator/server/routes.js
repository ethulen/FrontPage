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
	//GET method route for sources
	app.get("/", async (req, res) => {
		var sources = await knexDB("users").select('sources').where('sources', req.body.sources);
		console.log(sources)
		req.session.regenerate(async (err) => {
			if (err){
				console.log("Error!")
				console.log(err)
				next(err)
			}
		})
		res.status(200).json("Sources Retrieved")
	})
	// POST method route
	app.post("/register", async (req, res) => {
		//TODO: salt in addition to hash
		console.log(req.body.sourceList)
		password = await bcrypt.hash(req.body.password, saltRounds);
		val = await knexDB("users").insert({
			username: req.body.name,
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
			}
		}
	})
	app.get('/logout', (req, res) => {
		req.session.destroy();
		res.redirect('/');
	});
};

exports.setUpRoutes = setUpRoutes;
