var mongoose = require("mongoose")

// Creating mongoose quotes object structure for db and model
var motivationalQuotesSchema = new mongoose.Schema({
    quote: String,
    author: String,
    count: Number
});



module.exports = mongoose.model("MotivationalQuote", motivationalQuotesSchema);
