const db = require("../../data/dbConfig.js");

async function add(user) {
    let [id] = await db("users")
        .insert(user);
    return db("users")
        .where({id: id})
        .first();
}

async function findBy(parameter) {
    return await db("users")
        .where(parameter)
}

module.exports = {
    add,
    findBy
};