/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function (table) {
      table.increments('id')
      table.string('name', 20).unique().notNullable()
      table.string('email', 40).unique().notNullable()
      table.string('password', 255).notNullable()
      table.json('sources')
      table.string('salt', 20)
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable('users')
};
