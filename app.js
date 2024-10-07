// Import le module express
const express = require('express');

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
app.get("/articles", (request, response) => {
    return response.json(DB_ARTICLES);
});

app.get("/article/:id", (request, response) => {
    // Récupérer le param id (attention les param d'url sont en string)
    const id = parseInt(request.params.id);

    // Trouver un article par son id
    const foundArticle = DB_ARTICLES.find(article => article.id === id);

    return response.json(foundArticle);
});


app.post("/save-article", (request, response) => {
    // Récupérer l'article de la requete
    const articleJSON = request.body;

    // Si on trouve un article => Edition
    let foundArticle = DB_ARTICLES.find(article => article.id === articleJSON.id);

    if (foundArticle){
        foundArticle.title = articleJSON.title;
        foundArticle.content = articleJSON.content;
        foundArticle.author = articleJSON.author;

        // PS : return => arreter la fonction
        return response.json({ message: `L'article a été modifié avec succès`});
    }

    // Alors => Creation
    DB_ARTICLES.push(articleJSON);

    return response.json({ message: `Article crée avec succès` });
});

app.delete("/article/:id", (request, response) => {
    // Récupérer le param id (attention les param d'url sont en string)
    const id = parseInt(request.params.id);

    // Trouver l'index du tableau qui match avec le predicate (donc quand l'id de l'article dans l'occurence est valide)
    const foundIndex = DB_ARTICLES.findIndex(article => article.id === id)

    // Si pas trouvé
    if (foundIndex === -1){
        return response.json({ message: `L'article id => ${id} n'existe pas` });
    }

    // Par défaut supprimer element du tableau à partir de l'index foundIndex
    DB_ARTICLES.splice(foundIndex , 1);

    return response.json({ message: `Article id ${id} supprimé avec succès` });
});

// Démarrer le server
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});