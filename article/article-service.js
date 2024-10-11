// Importer mon modele Article
const ArticleDAOMock = require('./dao/article-dao-mock');
const { v4 : uuidv4 } = require('uuid');
const { buildAPIResponse } = require('../core/helpers-library');
//const helperStatics = require('../core/helpers-library');

const daoArticle = new ArticleDAOMock();

module.exports = {

    getAllArticles: async () => {
        // Récupérer la liste de tout les articles en base
        const articles = await daoArticle.findAll();

        return buildAPIResponse("200", "La liste des articles a été récupérés avec succès", articles);
    },

    getArticleById: async (id) => {
        // Trouver un article par son id
        const foundArticle = await daoArticle.findById(id);

        // Si trouve pas
        if (!foundArticle) {
            return buildAPIResponse("702", `Impossible de récupérer un article avec l'UID ${id}`, null);
        }

        return buildAPIResponse("200", "Article récupéré avec succès", foundArticle);
    },

    save: async (articleJSON) => {
        // Si on trouve un article => Edition
        let foundArticle = await daoArticle.findById(articleJSON.id);

        if (foundArticle) {
            // Tester si un article avec le meme titre que l'article envoyé en JSON
            const foundArticleByTitle = await daoArticle.findByTitleNo(articleJSON.title, articleJSON.id);

            if (foundArticleByTitle) {
                return buildAPIResponse("701", "Impossible de modifier un article si un autre article possède un titre similaire", null);
            }

            // Ecraser avec les nouvelles données
            foundArticle.title = articleJSON.title;
            foundArticle.content = articleJSON.content;
            foundArticle.author = articleJSON.author;

            // Save
            await daoArticle.update(articleJSON);

            // PS : return => arreter la fonction
            return buildAPIResponse("200", "Article modifié avec succès", foundArticle);
        }
        // Alors => Creation
        // Tester si un article avec le meme titre que l'article envoyé en JSON
        const foundArticleByTitle = await daoArticle.findByTitle(articleJSON.title);

        if (foundArticleByTitle) {
            return buildAPIResponse("701", "Impossible d'ajouter un article avec un titre déjà existant", null);
        }

        let newArticle = await daoArticle.create(articleJSON);

        return buildAPIResponse("200", " Article ajouté avec succès", newArticle)
    },

    delete : async (id) => {
        try {
            await daoArticle.delete(id)
        }
        catch {
            // Si pas trouvé
            return buildAPIResponse("702", `Impossible de supprimer un article dont l'UID n'existe pas`, null);
        }

        return buildAPIResponse("200", `L'article ${id} a été supprimé avec succès`, foundArticle);
    }
}