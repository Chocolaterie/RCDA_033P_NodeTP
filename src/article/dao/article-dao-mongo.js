const DAOCrud = require('./article-dao');
const Article = require('../article-model');
const { v4: uuidv4 } = require('uuid');

class ArticleDAOMongo extends DAOCrud {
    constructor() {
        super();
    }

    async findAll() {
        return await Article.find();
    }

    async findById(id) {
        return await Article.findOne({ id: id });
    }

    async create(data) {
        let newArticle = new Article(data);

        // generer un id
        newArticle.id = uuidv4();

        // save en base
        await newArticle.save();

        return newArticle;
    }

    async update(id, data) {
        let foundArticle = await Article.findOne({ id: id });

        // Ecraser avec les nouvelles données
        foundArticle.title = data.title;
        foundArticle.content = data.content;
        foundArticle.author = data.author;

        // Save
        await foundArticle.save();

        return foundArticle;
    }

    async delete(id) {
        // Trouver l'article
        const foundArticle = await Article.findOne({ id: id });

        if (!foundArticle) {
            throw Error("Article not exist")
        }

        // Supprimer l'article
        await foundArticle.deleteOne();
    }

    async findByTitle(title) {
        const foundArticleByTitle = await Article.findOne({ title: title });

        return foundArticleByTitle;
    }

    async findByTitleNo(title, id) {
        const foundArticleByTitle = await Article.findOne({ title: title, id: { $ne: id } });

        return foundArticleByTitle;
    }
}
