const mongoose = require('mongoose');

// Modèle article
const Article = mongoose.model(
    "Article", 
    { id : String, title: String, content : String, author: String }, 
    "articles");

// Exporter la classe en tant que tout le module
module.exports = Article;