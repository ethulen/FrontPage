const { createHash } = require('crypto');

const jwt = require("jsonwebtoken");
const hash = createHash('sha256');
const knexDB = require("./knex");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
			.select("id")
			.where("sources", req.body.sources);
		console.log(sources);
		req.session.regenerate(async (err) => {
			if (err) {
				console.log("Error!");
				console.log(err);
				next(err);
			}
		});
		res.status(200).json("Sources Retrieved");
	});
	// POST method route
	app.post("/register", async (req, res) => {
		try {
		  console.log(req.body.sourceList);
		  const password = await bcrypt.genSalt(saltRounds, function(err, salt) {
			bcrypt.hash(password, salt, function(err, hash) {
			  // returns hash
			  console.log(hash);
			});
		  });
		  const val = await knexDB("users").insert({
			username: req.body.name,
			email: req.body.email,
			password: password,
		  });
		  const user = await knexDB("users")
			.select("id")
			.where("username", req.body.name)
			.first();
		  console.log("userid " + user.id);
		  req.session.user = user.id;
	  
		  req.session.save(function (err) {
			if (err) {
			  console.log("Error2");
			  console.log(err);
			  return next(err);
			}
			console.log("saved");
			res.status(200).json("Login Saved!");
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
			if (await bcrypt.compare(req.body.password, existing_user.password)) {
				let session = req.session;
				console.log(req.session);				  
				req.session.regenerate(async (err) => {
					if (err) {
						console.log("Error!");
						console.log(err);
						next(err);
					}
				});
				console.log(req.body)
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
