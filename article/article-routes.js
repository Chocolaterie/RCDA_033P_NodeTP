const express = require('express');
const router = express.Router();

router.get("/all", async (request, response) => {
    
    const responseAPI = await articleService.getAllArticles();

    return response.json(responseAPI);
});

router.get("/:id", async (request, response) => {
    // Récupérer le param id (attention les param d'url sont en string)
    const id = request.params.id;

    const responseAPI = await articleService.getArticleById(id);

    return response.json(responseAPI);
});

router.post("/save", middlewareVerifyToken, async (request, response) => {
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

router.delete("/:id", middlewareVerifyToken, async (request, response) => {
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

// Exporter le router
module.exports = router;