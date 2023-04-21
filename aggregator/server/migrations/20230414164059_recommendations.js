/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('recommendations', function (table) {
    table.increments('id')
    table.string('namespace', 20).notNullable()
    table.string('person', 20).notNullable()
    table.string('action', 20)
    table.string('clicked_articles', 255)
    table.timestamp('clicked_at').defaultTo(knex.fn.now())
    table.timestamp('expires_at')
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
