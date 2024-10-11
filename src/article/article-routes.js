const express = require('express');
const router = express.Router();
const { middlewareVerifyToken } = require('../core/middlewares');
const articleService = require('./article-service');

router.get("/all", async (request, response) => {
    // #swagger.description = "L'entrypoint qui permet de récupérer la liste des articles"

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

    const responseAPI = await articleService.save(articleJSON);

    return response.json(responseAPI);
});

router.delete("/:id", middlewareVerifyToken, async (request, response) => {
    // Récupérer le param id (attention les param d'url sont en string)
    const id = request.params.id;

    const responseAPI = await articleService.delete(id);

    return response.json(responseAPI);
});

// Exporter le router
module.exports = router;