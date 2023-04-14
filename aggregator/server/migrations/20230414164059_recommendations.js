/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('recommendations', function (table) {
    table.increments('id')
    table.string('namespace', 20).notNullable()
    table.string('person', 20).unique().notNullable()
    table.string('action', 20)
    table.json('clicked_articles')
    table.timestamp('expires_at').defaultTo(knex.raw('date_add(?, INTERVAL ? day)', [knex.fn.now(), 365]))
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable('recommendations')
};
