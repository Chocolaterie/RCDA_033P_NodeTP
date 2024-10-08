// Import le module express
const express = require('express');

const { v4 : uuidv4 } = require('uuid');

// CONFIGURATION MONGO
const mongoose = require('mongoose');

// Connecte à la bdd
mongoose.connect("mongodb://127.0.0.1:27017/db_article");

// Afficher un message quand connectioné avec succès
mongoose.connection.once('open', () => {
    console.log(`Connecté(e) à la base`);
});

// Afficher message erreur si pas connecté
mongoose.connection.on('error', () => {
    console.log(`Erreur de connection à la base`);
});

// Modèle article
const Article = mongoose.model(
    "Article", 
    { id : String, title: String, content : String, author: String }, 
    "articles");

// instancier
const app = express();

// Autoriser à traiter les données qui sont dans le body de la requête
app.use(express.json());

// Simulation de données en mémoire
let DB_ARTICLES = [
    { id: 1, title: 'Premier article', content: 'Contenu du premier article', author: 'Isaac' },
    { id: 2, title: 'Deuxième article', content: 'Contenu du deuxième article', author: 'Sanchez' },
    { id: 3, title: 'Troisième article', content: 'Contenu du troisième article', author: 'Toto' }
];

// Creer les routes
app.get("/articles", async (request, response) => {

    // Récupérer la liste de tout les articles en base
    const articles = await Article.find();

    return response.json(articles);
});

app.get("/article/:id", async (request, response) => {
    // Récupérer le param id (attention les param d'url sont en string)
    const id = request.params.id;

    // Trouver un article par son id
    const foundArticle = await Article.findOne({ id : id});

    return response.json(foundArticle);
});


app.post("/save-article", async (request, response) => {
    // Récupérer l'article de la requete
    const articleJSON = request.body;

    // Si on trouve un article => Edition
    let foundArticle = await Article.findOne({ id : articleJSON.id});

    if (foundArticle){
        // Ecraser avec les nouvelles données
        foundArticle.title = articleJSON.title;
        foundArticle.content = articleJSON.content;
        foundArticle.author = articleJSON.author;

        // Save
        await foundArticle.save();

        // PS : return => arreter la fonction
        return response.json({ message: `L'article a été modifié avec succès`});
    }
    // Alors => Creation
    let newArticle = new Article(articleJSON);

    // generer un id
    newArticle.id = uuidv4();

    // save en base
    await newArticle.save();

    return response.json({ message: `Article crée avec succès` });
});

app.delete("/article/:id", async (request, response) => {
    // Récupérer le param id (attention les param d'url sont en string)
    const id = request.params.id;

    // Trouver l'article
    const foundArticle = await Article.findOne({ id : id });

    // Si pas trouvé
    /*
    if (foundIndex === -1){
        return response.json({ message: `L'article id => ${id} n'existe pas` });
    }
    */

    // Supprimer l'article
    await foundArticle.deleteOne();

    return response.json({ message: `Article id ${id} supprimé avec succès` });
});

// Démarrer le server
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});