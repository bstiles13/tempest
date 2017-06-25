var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var wreckSchema = new Schema({
        geometry: {}
});

UserSchema.index({geometry: '2dsphere'});

var Wreck = mongoose.model("Wreck", wreckSchema);

module.exports = Wreck;