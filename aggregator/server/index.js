//index.js
const morgan = require('morgan')
const { setUpRoutes } = require("./routes");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;
const bodyParser = require('body-parser');
const sessions = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
}));
app.use(morgan("combined"))
app.use(bodyParser.json());

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
	secret: "iunfvuieanfcaoirghaiwefnaeriupth5657563w43",
	saveUninitialized: true,
	cookie: { maxAge: oneDay, 
		sameSite: 'lax', secure: false, httpOnly: false
	},
	resave: false,
}));

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

setUpRoutes(app);

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server listening on ${PORT}`);
});