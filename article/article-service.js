// Importer mon modele Article
const Article = require('./article-model');

function buildAPIResponse(code, message, data){
    // Log
    console.log(`Code : ${code} - Message : ${message}`);
    
    return { code : code, message: message, data: data };
}

module.exports ={

    getAllArticles : async () => {
        // Récupérer la liste de tout les articles en base
        const articles = await Article.find();

        return buildAPIResponse("200", "La liste des articles a été récupérés avec succès", articles);
    },

    getArticleById : async (id) => {
        // Trouver un article par son id
        const foundArticle = await Article.findOne({ id : id});

        // Si trouve pas
        if (!foundArticle){
            return buildAPIResponse("702", `Impossible de récupérer un article avec l'UID ${id}`, null);
        }

        return buildAPIResponse("200", "Article récupéré avec succès", foundArticle);
    }
}