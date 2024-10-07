// Import le module express
const express = require('express');

// instancier
const app = express();

// Creer les routes
app.get("/articles", (request, response) => {
    return response.json({ message: `Retournera la liste des articles` });
});

app.get("/article/:id", (request, response) => {
    // Récupérer le param id (attention les param d'url sont en string)
    const id = request.params.id;

    return response.json({ message: `Retournera l'article ayant l'id ${id}` });
});

app.post("/save-article", (request, response) => {
    return response.json({ message: `Va créer/mettre à jour un article envoyé` });
});

app.delete("/article/:id", (request, response) => {
    // Récupérer le param id (attention les param d'url sont en string)
    const id = request.params.id;

    return response.json({ message: `Supprimera un article par l'id ${id}` });
});

// Démarrer le server
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});