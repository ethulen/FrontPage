//index.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'admin',
      password : 'Fr0ntP4g3!',
      database : 'FrontPage'
    }
  });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});