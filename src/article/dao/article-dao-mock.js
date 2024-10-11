const DAOCrud = require('./article-dao');

class ArticleDAOMock extends DAOCrud {
    constructor() {
        super();
        this.data =  [
            { id: '1', title: 'Teletubies', desc: 'Contenu du premier article', author: 'Isaac', imgPath: 'https://dogtime.com/wp-content/uploads/sites/12/2011/01/GettyImages-653001154-e1691965000531.jpg' },
            { id: '2', title: 'Deuxième article', desc: 'Contenu du deuxième article', author: 'Sanchez', imgPath: 'https://dogtime.com/wp-content/uploads/sites/12/2011/01/GettyImages-653001154-e1691965000531.jpg' },
            { id: '3', title: 'Troisième article', desc: 'Contenu du troisième article', author: 'Toto', imgPath: 'https://dogtime.com/wp-content/uploads/sites/12/2011/01/GettyImages-653001154-e1691965000531.jpg' }
        ]; // Stocke les données en mémoire
        this.nextId = 4; // Gestion des identifiants simples
    }

    async findAll() {
        return this.data;
    }

    async findById(id) {
        return this.data.find(item => item.id === id);
    }

    async create(data) {
        const newItem = { id: toString(this.nextId++), ...data };
        this.data.push(newItem);
        return newItem;
    }

    async update(id, data) {
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) return null;

        this.data[index] = { id, ...data };
        return this.data[index];
    }

    async delete(id) {
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) return null;

        const deletedItem = this.data.splice(index, 1);
        return deletedItem[0];
    }

    async findByTitle(title) {
        return this.data.find(item => item.title === title);
    }

    async findByTitleNo(title, id) {
        return this.data.find(item => item.title === title & item.id != id );
    }
}

module.exports = ArticleDAOMock;