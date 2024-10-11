const DAOCrud = require('../../core/dao-crud');

class ArticleDAO extends DAOCrud{
    async findByTitle(title) {
        throw new Error('Method not implemented');
    }

    async findByTitleNo(title, id) {
        throw new Error('Method not implemented');
    }
}

module.exports = ArticleDAO;