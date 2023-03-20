//index.js
const morgan = require('morgan')
const { setUpRoutes } = require("./routes");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000',
credentials: true}));
app.use(morgan("combined"))
setUpRoutes(app);

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server listening on ${PORT}`);
});