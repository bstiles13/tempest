var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var wreckSchema = new Schema({
        id: String,
        token: String,
        email: String,
        name: String,
        username: String,
        friends: [String]
});

var Wreck = mongoose.model("Wreck", wreckSchema);

module.exports = Wreck;