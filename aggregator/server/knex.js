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

knex.exports=knex;