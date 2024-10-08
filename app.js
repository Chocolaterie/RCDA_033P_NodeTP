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

// HELPERS/UTILITAIRE
function buildAPIResponse(code, message, data){
    // Log
    console.log(`Code : ${code} - Message : ${message}`);
    
    return { code : code, message: message, data: data};
}

function httpApiResponse(response, code, message, data) {
    return response.json(buildAPIResponse(code, message, data));
}

// Creer les routes
app.get("/articles", async (request, response) => {
    // Récupérer la liste de tout les articles en base
    const articles = await Article.find();

    return httpApiResponse(response, "200", "La liste des articles a été récupérés avec succès", articles);
});

app.get("/article/:id", async (request, response) => {
    // Récupérer le param id (attention les param d'url sont en string)
    const id = request.params.id;

    // Trouver un article par son id
    const foundArticle = await Article.findOne({ id : id});

    // Si trouve pas
    if (!foundArticle){
        return httpApiResponse(response, "702", `Impossible de récupérer un article avec l'UID ${id}`, null);
    }

    return httpApiResponse(response, "200", "Article récupéré avec succès", foundArticle);
});

app.post("/save-article", async (request, response) => {
    // Récupérer l'article de la requete
    const articleJSON = request.body;

    // Si on trouve un article => Edition
    let foundArticle = await Article.findOne({ id : articleJSON.id});

    if (foundArticle){
         // Tester si un article avec le meme titre que l'article envoyé en JSON
        const foundArticleByTitle = await Article.findOne({ title : articleJSON.title, id:{ $ne: foundArticle.id } });

        if (foundArticleByTitle){
            return httpApiResponse(response, "701", "Impossible de modifier un article si un autre article possède un titre similaire", null);
        }

        // Ecraser avec les nouvelles données
        foundArticle.title = articleJSON.title;
        foundArticle.content = articleJSON.content;
        foundArticle.author = articleJSON.author;

        // Save
        await foundArticle.save();

        // PS : return => arreter la fonction
        return httpApiResponse(response, "200", "Article modifié avec succès", foundArticle);
    }
    // Alors => Creation
    // Tester si un article avec le meme titre que l'article envoyé en JSON
    const foundArticleByTitle = await Article.findOne({ title : articleJSON.title });

    if (foundArticleByTitle){
        return httpApiResponse(response, "701", "Impossible d'ajouter un article avec un titre déjà existant", null);
    }

    let newArticle = new Article(articleJSON);

    // generer un id
    newArticle.id = uuidv4();

    // save en base
    await newArticle.save();

    return httpApiResponse(response, "200", " Article ajouté avec succès", newArticle);
});

app.delete("/article/:id", async (request, response) => {
    // Récupérer le param id (attention les param d'url sont en string)
    const id = request.params.id;

    // Trouver l'article
    const foundArticle = await Article.findOne({ id : id });

    // Si pas trouvé
    if (!foundArticle){
        return httpApiResponse(response, "702", `Impossible de supprimer un article dont l'UID n'existe pas`, null);
    }

    // Supprimer l'article
    await foundArticle.deleteOne();

    return httpApiResponse(response, "200", `L'article ${id} a été supprimé avec succès`, foundArticle);
});

// Démarrer le server
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});